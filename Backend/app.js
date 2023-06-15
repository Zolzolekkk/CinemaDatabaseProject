import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import path from "path";
import express from "express";

import router from "./routes/routes.js"
import userRouter from "./routes/userRoutes.js"
import roomRouter from "./routes/roomRoutes.js"
import programmeRouter from "./routes/programmeRoutes.js"


dotenv.config()


const mongoString = process.env.DATABASE_URL

/* *************************** */
/* Configuring the application */
/* *************************** */

// Databse connection
mongoose.connect(mongoString, { dbName: "Cinema" });
const database = mongoose.connection;


database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});

const app = express();
// app.locals.pretty = app.get("env") === "development"; // The resulting HTML code will be indented in the development environment
/* ************************************************ */
// app.use(morgan("dev"));
app.use(express.json());
/* ******** */
/* "Routes" */
/* ******** */

// app.use("/", router)
app.use("/api/users", userRouter)
app.use("/api/programmes", programmeRouter)
app.use("/api/rooms", roomRouter)


// app.get("/programme", async function (request, response) {
//   const client = new MongoClient(
//     "mongodb+srv://bazydanych2023agh:mongodb123@cinema.xo2lkmi.mongodb.net/"
//   );
//   await client.connect();
//   const db = client.db("Cinema");
//   const collection = db.collection("Programme");
//   const movies = await collection.find({}).toArray();
//   response.json(movies);
// });

// app.post("/seats", async function (request, response) {
//   const client = new MongoClient(
//     "mongodb+srv://bazydanych2023agh:mongodb123@cinema.xo2lkmi.mongodb.net/"
//   );
//   await client.connect();
//   const db = client.db("Cinema");
//   const collection = db.collection("Programme");
//   const programmeFound = (await collection
//     .find({ "_id": new ObjectId(request.body.id) }).toArray())[0];
//   console.log(programmeFound);
//   const seats = programmeFound.seats;
//   response.json(seats);
// });
/* ************************************************ */
app.listen(8000, function () {
  console.log("The server was started on port 8000");
  console.log('To stop the server, press "CTRL + C"');
});



// ./api/users
// ./api/programme/:id
