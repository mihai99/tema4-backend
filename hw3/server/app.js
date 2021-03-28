const db = require("./database/test");
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");

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

app.post("/boards", async (req, res) => {
  let { name, description } = req.body;
  console.log(name, description);
  if (!name) {
    console.log(name);
    res.status(400).send({ error: "Missing name" });
    return;
  }
  try {
    let resp = await db.collection("boards").add({
      name,
      description,
    });
    console.log(resp.id);
    res.status(201).send({ message: "Board created", id: resp.id });
    return;
  } catch (error) {
    console.log("err", error);
    res.status(500).send({ error: "Something bad happend" });
  }
});

app.listen(8080, () =>
  console.log("API is running on http://localhost:8080/login")
);
