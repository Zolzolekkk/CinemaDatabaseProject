import express from "express"
import Movie from "../model/movie.js"

const getMovies = async (req, res) => {
    try {
        const movies = await Movie.find({})
        res.status(200).json({ movies: movies })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

const getMovie = async (req, res) => {
    
}

export { getMovies }