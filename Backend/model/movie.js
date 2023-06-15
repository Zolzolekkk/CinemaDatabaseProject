import mongoose, { mongo } from "mongoose";

const dataSchema = new mongoose.Schema({
  imdbID: {
    required: true,
    type: String
  },
  title: {
    required: true,
    type: String
  },
  releseDate: {
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
}, { collation: 'Movies' }
)



export default mongoose.model("Movie", dataSchema)