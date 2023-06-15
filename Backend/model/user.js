import mongoose, { mongo } from "mongoose";
import userTicket from "./ticket.js"

const dataSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String
  },
  email: {
    required: true,
    type: String
  },
  surname: {
    required: true,
    type: String
  },
  password: {
    type: String,
    default: null
  },
  admin: {
    type: Boolean,
    default: false
  },
  tickets: [userTicket]
},
  { collection: 'Users' }
)



export default mongoose.model("User", dataSchema)