import { addRoom, getRooms } from "../controllers/roomController.js"
import express from "express";


const router = express.Router()


router.post("/addRoom", addRoom)
router.get("/", getRooms)


// USER API EXAMPLE:
// POST localhost:8000/api/rooms/addRoom - addRoom functionality
// {
//         "number": 6,
//         "rows": 4,
//         "cols": 4
// } -> { room: {} }


// GET localhost:8000/api/rooms - returns the list of rooms in our cinema
// {
//         "number": 6,
//         "rows": 4,
//         "cols": 4
// } -> { rooms: [{room}, {} ...] } 


export default router 