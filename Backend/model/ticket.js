import { ObjectId } from "mongodb";
import mongoose, { mongo } from "mongoose";

const dataSchema = new mongoose.Schema({
  //  Should be explicitly given
  id: {
    type: ObjectId,
    required: true
  },
  userId: {
    type: ObjectId,
    required: true
  },
  programmeId: {
    type: ObjectId,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  room: {
    type: ObjectId,
    required: true
  },
  row: {
    type: Number,
    required: true
  },
  seat: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['student', 'normal']
    ,
    required: true
  },
  "3d": {
    type: Boolean,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }


}
)


// export { dataSchema as userTicket }
export default dataSchema