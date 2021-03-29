const db = require("./database/test");
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");

const {createBoard, getBoard, deleteBoard, editBoard} = require('./routes/boards/index');
const { createPost, getPosts ,getPost, deletePost,editPost} = require("./routes/posts");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use("/login", async (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send({ error: "Missing email or password" });
    return;
  }
  try {
    const users = await db
      .collection("users")
      .where("email", "==", email)
      .get();
    console.log(users);
  } catch (error) {}
  res.send({
    token: "test123",
  });
});
app.use("/register", async (req, res) => {
  console.log(req.body);
  let { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send({ error: "Missing email or password" });
    return;
  }
  try {
    await db.collection("users").add({
      email,
      password,
    });
    res.status(201).send({ message: "User created" });
    return;
  } catch (error) {
    res.status(500).send({ error: "Something bad happend" });
  }
});

app.post("/board",createBoard);

app.get('/board/:id',getBoard)

app.delete('/board/:id',deleteBoard)

app.post('/board/:id',editBoard)

app.post('/board/:boardId/post',createPost)

app.get('/board/:boardId/posts',getPosts)

app.get('/board/:boardId/post/:postId',getPost)

app.delete('/board/:boardId/post/:postId',deletePost)

app.post('/board/:boardId/post/:postId',editPost)


app.listen(8080, () =>
  console.log("API is running on http://localhost:8080")
);
