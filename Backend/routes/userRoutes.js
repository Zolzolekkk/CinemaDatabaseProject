import { registerUser, loginUser, getUserTickets } from "../controllers/userController.js"
import express from "express"

const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/tickets", getUserTickets)

// USER API EXAMPLE:
//  REGISTER  localhost:8000/api/users/register - register a new User
// {
//   "name": "jakub",
//   "email":"jakub@barb",
//   "surname": "Barb",
//   "password": "barb123"
// } -> response { user: { email: foundUser.email, id: foundUser._id, name: foundUser.name, surname: foundUser.surname } }

//  LOGIN localhost:8000/api/users/login - login with user credentials
// {
//   "email":"jakub@barb",
//   "password": "barb123"
// } -> { user: { email: foundUser.email, id: foundUser._id, name: foundUser.name, surname: foundUser.surname } }

// GET USER TICKETS   GET localhost:8000/api/users/tickets - list tickets of given User
// {
//     "userid": "648c919b72e2afe3249e7495"
// } -> { tickets: [userTickets]}

export default router 