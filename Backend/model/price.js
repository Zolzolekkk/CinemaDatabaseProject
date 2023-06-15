import mongoose, { mongo } from "mongoose";

const dataSchema = new mongoose.Schema({
  normal: {
    "2d": {
      required: true,
      type: Number
    },
    "3d": {
      required: true,
      type: Number
    }
  },
  student: {
    "2d": {
      required: true,
      type: Number
    },
    "3d": {
      required: true,
      type: Number
    }
  },
  startdate: {
    required: true,
    type: Date
  },
  enddate: {
    required: true,
    type: Date
  }

},
  { collection: 'Prices' }
)

export default mongoose.model("Price", dataSchema)