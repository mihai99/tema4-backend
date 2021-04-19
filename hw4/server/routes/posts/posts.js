const pool = require("../../database/db");
const { Request } = require("tedious");
const { sendMessage } = require("../../services/pubsub");
const { v4 }= require('uuid');
var base64 = require('base-64');
const createPost = async (req, res) => {
  let boardId = req.params.boardId;
  let email = req.body.email ? req.body.email : null;
  let { title, body } = req.body;
  let file_id = v4().toString();
  if (!title || !body ||!file_id) {
    res.status(400).send({ error: "Missing title or body" });
    return;
  }
  pool.acquire((err, connection) => {
    console.log("error", err);
    if (err) {
      return res.status(500).send({ error: "Something bad happened" });
    }
    const sql = `INSERT INTO cards(title, body, board_id,file_id)
    VALUES (' ${title}', '${body}', ${boardId},'${file_id}'); select @@identity`;
    const request = new Request(sql, (err, rowCount) => {
      if (err) {
        
        console.error("Cards query error", err);
        return res.status(500).send({ error: "Something bad happened" });
      } else {
        // console.log("All good", rowCount);
        sendMessage(boardId);
        connection.release();
      }
    });
    request.on("row", (columns) => {
      console.log(columns);
      res.status(201).send({ message: "Post created", id: columns[0].value ,file_id:file_id});
    });
    connection.execSql(request);
    return;
  });
};

const getPosts = async (req, res) => {
  let boardId = req.params.boardId;
  pool.acquire((err, connection) => {
    if (err) {
      return res.status(500).send({ error: "Something bad happened" });
    }
    const sql = `SELECT * FROM cards WHERE board_id = ${boardId}`;
    const request = new Request(sql, (err, rowCount, rows) => {
      if (err) {
        console.error("Boards query error", err);
        res.status(500).send({ error: "Something bad happend" });
      } else {
        if (rowCount == 0) {
          res.status(200).send({ message: "ok", posts: [] });
          return;
        }
        console.log("All good", rowCount, rows);
        const arrayObj = [];
        rows.forEach((row) => {
          console.log('here',row);
          const newObj = {
            id: row[0].value,
            title: row[1].value || "",
            body: row[2].value || "",
            file_id :row[5].value||""
          };
          arrayObj.push(newObj);
        });
        res.status(200).send({ message: "ok", posts: arrayObj });
        connection.release();
      }
    });

    connection.execSql(request);
  });
};

const getPost = async (req, res) => {
  try {
    let postId = req.params.postId;
    let boardId = req.params.boardId;
    pool.acquire((err, connection) => {
      if (err) {
        return res.status(500).send({ error: "Something bad happened" });
      }
      const sql = `SELECT * FROM cards WHERE id = ${postId}`;
      const request = new Request(sql, (err, rowCount, rows) => {
        if (err) {
          console.error("Boards query error", err);
          res.status(500).send({ error: "Something bad happend" });
        } else {
          if (rowCount == 0) {
            res.status(404).send({ erorr: "Post not found" });
            return;
          }
          console.log("All good", rowCount, rows);
          const row = rows[0];
          const newObj = {
            id: row[0].value,
            title: row[1].value || "",
            body: row[2].value || "",
          };
          res.status(200).send({ message: "ok", data: newObj });
          connection.release();
        }
      });

      connection.execSql(request);
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Something bad happend" });
  }
};

const deletePost = async (req, res) => {
  try {
    let boardId = req.params.boardId;
    let postId = req.params.postId;
    let rest = await db
      .collection("boards")
      .doc(boardId)
      .collection("posts")
      .doc(postId);
    rest.get().then((doc) => {
      if (doc.exists) {
        rest.delete().then((e) => {
          res.status(200).send({ message: "Deleted" });
        });
      } else {
        res.status(404).send({ error: "Not found" });
      }
    });
  } catch (e) {
    res.status(500).send({ error: "Something bad happend" });
  }
};

const editPost = async (req, res) => {
  let { email, title, body } = req.body;
  let boardId = req.params.boardId;
  let postId = req.params.postId;
  try {
    let rest = await db
      .collection("boards")
      .doc(boardId)
      .collection("posts")
      .doc(postId);
    let d = await rest.get();
    if (!d.exists) {
      res.status(404).send({ message: "Not found" });
      return;
    }
    let data = d.data();
    let updateData = { email, title, body };
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] == undefined) delete updateData[key];
    });
    console.log(updateData);
    rest
      .update({ ...data, updateData })
      .then((e) => {
        res.status(200).send({ message: "updated" });
      })
      .catch((e) => {
        res.status(500).send({ error: "Something bad happend" });
      });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Something bad happend" });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  deletePost,
  editPost,
};
