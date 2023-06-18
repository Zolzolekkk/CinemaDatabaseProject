import mongoose, { mongo } from "mongoose";
import singleSeance from "./singleSeance.js";
import dataSchema from "./ticket.js";

const programmeSchema = new mongoose.Schema({
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


const dayNames = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
programmeSchema.statics.populateQuery = async function (programme) {
  for (const day of dayNames) {
    await this.populate(programme, {
      path: `days.${day}.seanses`,
      model: 'SingleSeance',
      populate: [
        {
          path: 'movieid',
          model: 'Movie'
        },
        {
          path: 'room',
          model: 'Room'
        }
      ]
    });
  }
  return programme
}

programmeSchema.statics.populatePogrammeArray = async function (programmes) {
  const populatedProgrammes = await Promise.all(
    programmes.map(programme =>
      this.populateQuery(programme)
    )
  );
  return populatedProgrammes
}

export default mongoose.model("Programme", programmeSchema)