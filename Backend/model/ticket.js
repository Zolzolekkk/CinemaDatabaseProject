import { ObjectId } from "mongodb";
import mongoose, { mongo } from "mongoose";

const dataSchema = new mongoose.Schema({
  //  Should be explicitly given
  id: {
    type: ObjectId,
    required: true
  },
  userid: {
    type: ObjectId,
    required: true
  },
  programmeid: {
    type: ObjectId,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['student', 'normal']
    ,
    required: true
  },
  buydate: {
    type: Date,
    default: Date.now
  },
  movieinfo: {
    moviename: {
      required: true,
      type: String
    },
    moviedate: {
      required: true,
      type: Date
    },
    "3d": {
      type: Boolean,
      required: true
    },
    seatinfo: {
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
      }
    }
  }

}
)


// export { dataSchema as userTicket }
export default dataSchema