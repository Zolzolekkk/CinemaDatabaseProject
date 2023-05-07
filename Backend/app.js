import express from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { MongoClient } from "mongodb";
/* *************************** */
/* Configuring the application */
/* *************************** */
const app = express();
const __filename = fileURLToPath(import.meta.url);
app.locals.pretty = app.get("env") === "development"; // The resulting HTML code will be indented in the development environment
/* ************************************************ */
app.use(morgan("dev"));
app.use(express.json());
/* ******** */
/* "Routes" */
/* ******** */
app.get("/programme", async function (request, response) {
  const client = new MongoClient(
    "mongodb+srv://bazydanych2023agh:mongodb123@cinema.xo2lkmi.mongodb.net/"
  );
  await client.connect();
  const db = client.db("Cinema");
  const collection = db.collection("Programme");
  const movies = await collection.find({}).toArray();

  response.json(movies);
});

app.post("/seats", async function (request, response) {
  const client = new MongoClient(
    "mongodb+srv://bazydanych2023agh:mongodb123@cinema.xo2lkmi.mongodb.net/"
  );
  await client.connect();
  const db = client.db("Cinema");
  const collection = db.collection("Programme");
  console.log(`Request body ${request.body}`);
  const programmeFound = await collection.find({
    _id: request.body,
  });
  // const movies = await collection.find({_id:  request.body }).toArray()[0];

  // const result = await movies.insertOne(request.body);
  // request.on("end", () => {
  //   response.json(movies);
  // });
  response.json({ programme: programmeFound });
});
/* ************************************************ */
app.listen(8000, function () {
  console.log("The server was started on port 8000");
  console.log('To stop the server, press "CTRL + C"');
});
