import express from "express";
import { getMovies, getMovie } from "../controllers/movieController.js";


const router = express.Router()
router.get("/", getMovies)
router.get("/getOneMovie", getMovie)

// GET localhost: 8000 / api / movies / -> list of all movies
// GET localhost: 8000 / api / movies / getOneMovie -> movie of specified id: 
// {
//  movieid: ""
// }


export default router