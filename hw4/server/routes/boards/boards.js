const pool = require("../../database/db");
const { Request } = require("tedious");

const createBoard = async (req, res) => {
  let { name, description } = req.body;

  if (!name || !description) {
    console.log(name, description);
    res.status(400).send({ error: "Missing name or description" });
    return;
  }
  pool.acquire((err, connection) => {
    console.log("error", err);
    if (err) {
      return res.status(500).send({ error: "Something bad happened" });
    }
    const sql = `INSERT INTO boards(name, description)
    VALUES (' ${name}', '${description}'); select @@identity`;
    const request = new Request(sql, (err, rowCount) => {
      if (err) {
        console.error("Boards query error", err);
        return res.status(500).send({ error: "Something bad happened" });
      } else {
        console.log("All good", rowCount);
        connection.release();
      }
    });
    request.on("row", (columns) => {
      console.log(columns);
      res.status(201).send({ message: "Board created", id: columns[0].value });
    });
    connection.execSql(request);
  });
};

const deleteBoard = async (req, res) => {
  let id = req.params.id;
  pool.acquire((err, connection) => {
    console.log("error", err);
    if (err) {
      return res.status(500).send({ error: "Something bad happened" });
    }
    const sql = `DELETE FROM boards WHERE id = ${id}`;
    const request = new Request(sql, (err, rowCount) => {
      if (err) {
        console.error("Boards query error", err);
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

const getBoard = async (req, res) => {
  let id = req.params.id;
  pool.acquire((err, connection) => {
    if (err) {
      return res.status(500).send({ error: "Something bad happened" });
    }
    const sql = `SELECT * FROM boards WHERE id = ${id}`;
    const request = new Request(sql, (err, rowCount) => {
      if (err) {
        console.error("Boards query error", err);
        res.status(500).send({ error: "Something bad happend" });
      } else {
        if (rowCount == 0) {
          res.status(404).send({ error: "Not found" });
          return;
        }
        console.log("All good", rowCount);
        connection.release();
      }
    });
    request.on("row", (columns) => {
      console.log(columns);
      let obj = {
        id: columns[0].value || -1,
        name: columns[1].value || "",
        description: columns[2].value || "",
      };
      res.status(200).send({ message: "Received Data", data: obj });
    });

    connection.execSql(request);
  });
};

// const editBoard = async (req, res) => {
//   try {
//     let id = req.params.id;
//     let { name, description } = req.body;
//     if (!name || !description) {
//       console.log(name);
//       res.status(400).send({ error: "Missing name or description" });
//       return;
//     }
//     let doc = await connection.collection("boards").doc(id);
//     data = { description, name };

//     doc.update(data).then((e) => {
//       res.status(200).send({ message: "Update" });
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(500).send({ error: "Something bad happend" });
//   }
// };

module.exports = { createBoard, getBoard, deleteBoard };
