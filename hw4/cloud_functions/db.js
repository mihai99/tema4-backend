const { Connection, Request } = require("tedious");
const ConnectionPool = require("tedious-connection-pool");
require("dotenv").config();

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_KEY);
// Create connection to database
var poolConfig = {
  min: 1,
  max: 20,
  log: true,
};

var connectionConfig = {
  userName: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  options: {
    port: 1433,
    database: process.env.DB_NAME,
    encrypt: true,
    rowCollectionOnRequestCompletion: true,
  },
};

const pool = new ConnectionPool(poolConfig, connectionConfig);

pool.on("error", function (err) {
  console.error(err);
});

const sendMail = (link, email) => {
  let a1 = link;
  const msg = {
    to: email, // Change to your recipient
    from: "cc_tema3@mailinator.com", // Change to your verified sender
    subject: "Your board has a new post!!!!!",
    text: "and easy to do anywhere, even with Node.js",
    html: `<strong>GO TO  <a href = ${a1}>${a1}</a> and read the latest updates </strong>`,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
      console.error(error.response.body);
    });
};

const getEmails = (boardId) => {
  return pool.acquire((err, connection) => {
    if (err) {
      return res.status(500).send({ error: "Something bad happened" });
    }
    console.log("got here");
    const sql = `SELECT * FROM subscribers WHERE board_id = ${boardId}`;
    const request = new Request(sql, (err, rowCount, rows) => {
      if (err) {
        console.error("Subscribers query error", err);
        return;
      } else {
        if (rowCount == 0) {
          return [];
        }
        let users = [];
        rows.forEach((row) => {
          users.push(row[1].value);
        });
        console.log(users);
        users.forEach((user) => {
          sendMail(process.env.CLIENT_ENDPOINT, user);
        });
        connection.release();

        return users;
      }
    });

    connection.execSql(request);
  });
};
module.exports = { getEmails };
