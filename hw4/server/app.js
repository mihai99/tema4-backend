const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();
var cors = require('cors');

app.use(cors());
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



const boardController = require("./routes/boards");
const subsController = require("./routes/subscribers");
const {

  createPost,
  getPosts,
  getPost,
  deletePost,
  editPost,
} = require("./routes/posts");
const { uploadFileRoute, getFileRoute } = require("./routes/file/file");

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

app.post("/board", boardController.createBoard);

app.get("/board/:id", boardController.getBoard);

app.delete("/board/:id", boardController.deleteBoard);

app.get("/boards/all/:user_id", boardController.getAllBoards)
// app.post("/board/:id", editBoard);

app.post("/board/:boardId/post", createPost);

app.get("/board/:boardId/posts", getPosts);

app.get("/board/:boardId/post/:postId", getPost);

app.delete("/board/:boardId/post/:postId", deletePost);

app.post("/board/:boardId/post/:postId", editPost);

app.post("/board/:boardId/user", subsController.createSubscriber);

app.post('/file/upload/:id',uploadFileRoute)

app.get('/file/:id',getFileRoute)
app.get('/test',(req,res)=>
{
  res.send('hello')
})

app.listen(8080, () => console.log("API is running on http://localhost:8080"));


