const pool = require("../../database/db");
const { Request } = require("tedious");

const createBoard = async (req, res) => {
  let { name, description, userId } = req.body;
  console.log("Id>>", userId)
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
    const sql = `INSERT INTO boards(name, description, user_id)
    VALUES (' ${name}', '${description}', ${userId}); select @@identity`;
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
        return;
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
      console.log("col>>", columns);
      let obj = {
        id: columns[0].value || -1,
        name: columns[1].value || "",
        description: columns[2].value || "",
        userId: columns[3] && columns[3].value || ""
      };
      res.status(200).send({ message: "Received Data", data: obj });
    });

    connection.execSql(request);
  });
};


const getAllBoards = async (req, res) => {
  console.log("aici")
  const userId = req.params.user_id;
  console.log(userId)
  pool.acquire((err, connection) => {
    if (err) {
      return res.status(500).send({ error: "Something bad happened" });
    }
    const sql = `SELECT * FROM boards where user_id = ${userId}`;
    console.log(sql)
    const request = new Request(sql, (err, rowCount, rows) => {
      if (err) {
        console.error("Boards query error", err);
        res.status(500).send({ error: "Something bad happend" });
        return;
      } else {
        if (rowCount == 0) {
          res.status(404).send({ error: "Not found" });
          return;
        } else {
          console.log(rows);
          const result = [];
          rows.forEach(row => {
            result.push({
              id: row[0].value || -1,
              name: row[1].value || "",
              description: row[2].value || "",
              userId: row[3] && row[3].value || ""
            })
          })
          res.status(200).send({ message: "Received Data", data: result })
        }
        console.log("All good", rowCount);
        connection.release();
      } 
    });
    // const boards = []
    // request.on("row", (columns) => {
    //   console.log(columns);
    //   let obj = {
    //     id: columns[0].value || -1,
    //     name: columns[1].value || "",
    //     description: columns[2].value || "",
    //   };
    //   boards.push(obj);
    //   console.log(obj)
    // });
    // console.log("board>> ", boards)
   // res.status(200).send({ message: "Received Data"});
  //  return;

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
module.exports.getAllBoards = getAllBoards;