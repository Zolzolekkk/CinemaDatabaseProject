import mongoose, { mongo } from "mongoose";
import userTicket from "./ticket.js"
import { ObjectId } from "mongodb";

const dataSchema = new mongoose.Schema({
  movieid: {
    required: true,
    type: ObjectId
  },
  "3d": {
    type: Boolean,
    default: false
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room'
  },
  starttime: {
    required: true,
    type: Date
  },
  endtime: {
    required: true,
    type: Date
  },
  seats: [
    {
      row: {
        type: Number,
        required: true
      },
      seats: [
        {
          number: {
            type: Number,
            required: true
          },
          availability: {
            type: Boolean,
            default: true
            // required: true
          }
        }
      ]
    }
    // [
    //   {
    //     number: {
    //       type: Number,
    //       required: true
    //     }
    //   },
    //   {
    //     availability: {
    //       type: Boolean,
    //       required: true
    //     }
    //   }
    // ]

  ],
  tickets: [userTicket]

}

)


export default dataSchema
// export default mongoose.model("SingleSeance", dataSchema)