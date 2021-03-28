// import googleCreds from "../cloud-computing-2021-uaic-a68db42ac4a5.json";
const { Firestore } = require("@google-cloud/firestore");

const db = new Firestore({
  // projectId: googleCreds.project_id,
  projectId: "cloud-computing-2021-uaic",
  keyFilename: "./database/cloud-computing-2021-uaic-a68db42ac4a5.json",
});

const test = async () => {
  db.collection("cities")
    .doc("la")
    .set({
      name: "Los Angeles",
      state: "CA",
      country: "USA",
    })
    .then(() => {
      console.log("Document successfully written!");
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
  console.log("inserted");
};
// test();

module.exports = db;
