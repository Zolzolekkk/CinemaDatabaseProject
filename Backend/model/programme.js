import mongoose, { mongo } from "mongoose";
import singleSeance from "./singleSeance.js";

const dataSchema = new mongoose.Schema({
  starttime: {
    required: true,
    type: Date
  },
  endtime: {
    required: true,
    type: Date
  },
  days: {
    monday: {
      seanses: [singleSeance]
    },
    tuesday: {
      seanses: [singleSeance]
    },
    wednesday: {
      seanses: [singleSeance]
    },
    thursday: {
      seanses: [singleSeance]
    },
    friday: {
      seanses: [singleSeance]
    },
    saturday: {
      seanses: [singleSeance]
    },
    sunday: {
      seanses: [singleSeance]
    }
  }
},
  { collection: 'Programme' }
)

export default mongoose.model("Programme", dataSchema)