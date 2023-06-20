// import { } from "../controllers/ticketontroller.js"
import express from "express";
import { testAddTicket } from "../controllers/ticketController.js"

const router = express.Router()


router.post("/addTicket", testAddTicket)

// POST localhost:8000/api/tickets/addTicket
// {
//   "date": "2023-07-15T12:30:00.000+00:00",
//     "seanseid": "648f47f3f24cb58f210eeb4e",
//         "name" : "Kuba",                           -> required if u provide only email
//           "surname": "Kubowski",                   -> required if u provide only email
//             "userid": "648ed10db3ae7d47d7f2ab27", -> optional but one of two
//               // "email": "testowyKuba",          -> optional but one of two
//               // seats: [{row: , col, type: , price: }]
// } -> returns added ticket { ticket: ticket } or message info with error and status 404

export default router 