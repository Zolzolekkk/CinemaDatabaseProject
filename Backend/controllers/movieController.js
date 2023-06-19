import express from "express"
import Movie from "../model/movie.js"
import { ObjectId } from "mongoose"
import mongoose from "mongoose"

const getMovies = async (req, res) => {
    try {
        const movies = await Movie.find({})
        res.status(200).json({ movies: movies })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

//  re {moveiid: }
//  api/seats/movieId
const getMovie = async (req, res) => { //movieid

    const ObjectId = mongoose.Types.ObjectId;
    const movieid = req.body.movieid;

    try {
        const movie = await Movie.findById(new ObjectId(movieid));

        if (!movie) {
            throw new Error("This movie doesn't exist");
        }

        res.status(200).json({ movie: movie })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

export { getMovies, getMovie }