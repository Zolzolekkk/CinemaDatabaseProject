import mongoose, { mongo } from "mongoose";

const dataSchema = new mongoose.Schema({
  imdbId: {
    required: true,
    type: String
  },
  title: {
    required: true,
    type: String
  },
  releaseDate: {
    required: true,
    type: String
  },
  trailerLink: {
    type: String
  },

  genres: [String],

  poster: {
    required: true,
    type: String
  },
  backdrops: [String]
}, { collection: 'Movies' }
)



export default mongoose.model("Movie", dataSchema)