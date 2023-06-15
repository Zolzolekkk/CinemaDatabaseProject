import { addRoom, getRooms } from "../controllers/roomController.js"
import express from "express";


const router = express.Router()


router.post("/room", addRoom)
router.get("/room", getRooms)


export default router 