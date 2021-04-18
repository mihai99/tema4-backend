const pool = require("../../database/db");
const { Request } = require("tedious");

const createSubscriber = async (req, res) => {
  let { email, boardId } = req.body;

  if (!email || !boardId) {
    res.status(400).send({ error: "Missing email or board id" });
    return;
  }
  pool.acquire((err, connection) => {
    console.log("error", err);
    if (err) {
      return res.status(500).send({ error: "Something bad happened" });
    }
    const sql = `INSERT INTO subscribers(email, board_id)
    VALUES (' ${email}', ${boardId})`;
    const request = new Request(sql, (err, rowCount) => {
      if (err) {
        console.error("Subscribers query error", err);
        return res.status(500).send({ error: "Something bad happened" });
      } else {
        console.log("All good", rowCount);
        connection.release();
        res.status(201).send({ message: "Subscriber created" });
        return;
      }
    });

    connection.execSql(request);
  });
};

const deleteSubscriber = async (req, res) => {
  let { email } = req.body;
  pool.acquire((err, connection) => {
    console.log("error", err);
    if (err) {
      return res.status(500).send({ error: "Something bad happened" });
    }
    const sql = `DELETE FROM subscribers WHERE email = ${email}`;
    const request = new Request(sql, (err, rowCount) => {
      if (err) {
        console.error("Subscribers query error", err);
        res.status(500).send({ error: "Something bad happend" });
      } else {
        if (rowCount == 0) {
          res.status(404).send({ error: "Not found" });
          return;
        }
        console.log("All good", rowCount);
        connection.release();
        res.status(200).send({ message: "Deleted" });
      }
      return;
    });
    connection.execSql(request);
  });
};

module.exports = { createSubscriber, deleteSubscriber };
