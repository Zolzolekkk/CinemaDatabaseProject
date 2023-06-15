import mongoose, { mongo } from "mongoose";

const dataSchema = new mongoose.Schema({
  number: {
    required: true,
    type: Number
  },
  rows: {
    required: true,
    type: Number
  },
  cols: {
    required: true,
    type: Number
  }

}, { collection: 'Rooms' }
)



export default mongoose.model("Room", dataSchema)