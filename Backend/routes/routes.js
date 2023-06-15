import express from "express";
import Room from "../model/room.js"
import { testPost, testGet, addProgrammeTest, addSeanceTest, testUserPost } from "../controllers/testController.js"


const router = express.Router()


router.post("/room", testPost)
router.get("/room", testGet)
router.post("/addProgramme", addProgrammeTest)
router.post("/addSeanse", addSeanceTest)
router.post("/addUser", testUserPost)

// router.post("/seats", async function (request, response) {
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


// {
//   "date": "2023-06-15T08:30:00.000+00:00",
//     "room": "648b480816790d34c966f4a8",
//       "starttime" : "2023-06-15T08:30:00.000+00:00",
//         "endtime": "2023-06-15T08:30:00.000+00:00",
//           "is3d": false,
//             "movieid": "645804cd9bbe2826034dbaa6"
// }

export default router;