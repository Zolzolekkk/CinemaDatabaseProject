// import { } from "../controllers/ticketontroller.js"
import express from "express";
import { testAddTicket } from "../controllers/ticketController.js"

const router = express.Router()


router.post("/addTicket", testAddTicket)



export default router 