import Programme from "../model/programme.js"
import Movie from "../model/movie.js"
import Room from "../model/room.js"
import singleSeance from '../model/singleSeance.js';
import mongoose from "mongoose";
import { ObjectId } from "mongoose"

const x = 2;
const dayNames = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const getDayName = (number) => number !== 0 ? dayNames[number - 1] : "sunday"

const checkPotentialOverlap = (start1, end1, start2, end2) => {
  return (start1 <= start2 && end1 >= end2) ||
    (start1 >= start2 && start1 <= end2) ||
    (end1 >= start2 && end1 <= end2)
}

const createEmptyRoom = (rows, cols) => {
  const seats = []
  for (let row = 1; row <= rows; row++) {
    const rowSeats = []
    for (let number = 1; number <= cols; number++) {
      rowSeats.push({
        number: cols * (row - 1) + number,
        availability: true
      });
    }
    seats.push({
      row: row,
      seats: rowSeats
    })
  }
  return seats
}

//programme przyjmuje starttime, endtime (w tym dzikim formacie daty)
const addProgramme = async (req, res) => { //to do: czy seanse na siebie nie nachodzą w danym roomie i w danych tygodniach
  //todo: czy to jest tydzień, czyli od ponedziałku do niedzieli
  const starttime = new Date(req.body.starttime); //todo: sprawdzić czy od poniedziałku do niedzieli
  const endtime = new Date(req.body.endtime);
  starttime.setUTCHours(0, 0, 0, 0)
  endtime.setUTCHours(23, 59, 59, 999)
  try {
    if (getDayName(starttime.getUTCDay()) !== 'monday' || getDayName(endtime.getUTCDay()) !== 'sunday') {
      throw new Error("Programme must take whole week (from monday to sunday) ")
    }
    const programmeFound = await Programme.findOne({ //todo: check if exists etc. - done
      $expr: {
        $and: [
          {
            $gte: [
              { $dateToString: { format: '%Y-%m-%d', date: '$starttime' } },
              { $dateToString: { format: '%Y-%m-%d', date: starttime } }
            ]
          },
          {
            $lte: [
              { $dateToString: { format: '%Y-%m-%d', date: '$endtime' } },
              { $dateToString: { format: '%Y-%m-%d', date: endtime } }
            ]
          }
        ]
      }
    });
    if (programmeFound) {
      throw new Error(`Program in given timestamps already exists and has id: ${programmeFound._id}`)
    }
    const programme = new Programme({
      starttime: starttime,
      endtime: endtime,
      days: {
        monday: { seanses: [] },
        tuesday: { seanses: [] },
        wednesday: { seanses: [] },
        thursday: { seanses: [] },
        friday: { seanses: [] },
        saturday: { seanses: [] },
        sunday: { seanses: [] }
      }
    });
    const savedProgramme = await programme.save();
    res.json({ programme: savedProgramme });
  } catch (err) {
    res.json({ message: err.message })
  }
};



const addSeanse = async (req, res) => { //date, room (id), starttime, endtime, is3d, movieid 
  try {
    const ObjectId = mongoose.Types.ObjectId;
    const date = new Date(req.body.date);
    const programme = await Programme.findOne({ //todo: check if exists etc. - done
      starttime: { $lte: date },
      endtime: { $gte: date }
    });
    if (!programme) {
      throw new Error("Programme doesn't exist"); //todo?: sprawdzić, czy istnieje program, jeśli nie, to stworzyć nowy i dodać seans (startdate poniedziałek, enddate niedziela)
    }
    const day = getDayName(date.getUTCDay());
    const foundRoom = await Room.findById(new ObjectId(req.body.room));
    console.log(`FoundRoom: ${foundRoom}`)
    if (!foundRoom) {
      throw new Error("This room doesn't exist");
    }
    const starttime = new Date(req.body.starttime); //todo: check if room isn't occupied for seance time - done
    const endtime = new Date(req.body.endtime);

    const dailySeanses = programme.days[day].seanses
    const existsRoomCollision = dailySeanses.find(seanse => req.body.room === seanse.room.toString() && checkPotentialOverlap(starttime, endtime, new Date(seanse.starttime), new Date(seanse.endtime)))

    if (existsRoomCollision) {
      throw new Error("Provided Room is occupied at the same time")
    }

    // checking if movie exists
    const movie = await Movie.findById(new ObjectId(req.body.movieid));

    if (!movie) {
      throw new Error("Movie doesn't exist");
    }

    const seats = createEmptyRoom(foundRoom.rows, foundRoom.cols)
    const seanse = {
      movieid: new ObjectId(req.body.movieid),
      "3d": req.body.is3d,
      room: new ObjectId(req.body.room),
      starttime: starttime,
      endtime: endtime,
      seats: seats,
      tickets: []
    };
    programme.days[day].seanses.push(seanse);
    const updatedProgramme = await programme.save();
    res.json({ programme: updatedProgramme, seanse: seanse });
  } catch (err) {
    res.json({ message: err.message })
  }
};


// getting programme id, seance id, date
const getSeanseAvaiability = async (req, res) => {
  const date = new Date(req.body.date)
  try {
    const programme = await Programme.findById(req.body.programmeId)
    if (!programme) {
      throw new Error("Programme of given id doesn't exist")
    }
    const day = getDayName(date.getUTCDay());
    const seanses = programme.days[day].seanses;
    let seanseFound = null
    for (let seanse of seanses) {
      if (seanse._id.equals(req.body.seanseid)) {
        seanseFound = seanse
        break;
      }
    }
    if (!seanseFound) {
      throw new Error("No seance of given id for provided programme")
    }

    const seats = []
    for (const row of seanseFound.seats) {
      const rowSeats = row.seats.map(el => el.availability)
      seats.push(rowSeats)
    }
    res.status(200).json({ seats: seats })
  }
  catch (err) {
    res.status(400).json({ message: err.message })
  }
}



const getSeancesOfTheWeek = async (req, res) => { //przesłać current date and current date + 7days
  const date = new Date(req.body.date)
  try {
    const programme = await Programme.findOne({
      starttime: { $lte: date },
      endtime: { $gte: date }
    })
    await Programme.populateQuery(programme)
    if (!programme) {
      throw new Error("Programme doesn't exist")
    }
    res.status(200).json({ programme: programme });
  }
  catch (err) {
    res.status(400).json({ message: err.message })
  }
}

const getProgrammeForXWeeksAheadPopulated = async (req, res) => { //przesłać current date and current date + 7days
  const date = new Date()
  try {
    const programmes = await Programme.find({
      endtime: { $gte: date }
    }).sort({ endtime: 1 })
      .limit(x)
    if (programmes.length === 0) {
      throw new Error("Programme doesn't exist")
    }
    await Programme.populatePogrammeArray(programmes)
    res.status(200).json({ programmes: programmes });
  }
  catch (err) {
    res.status(400).json({ message: err.message })
  }
}


const deleteSeanse = async (req, res) => { // date, seanseid
  const date = new Date(req.body.date)
  try {
    const programme = await Programme.findOne({
      starttime: { $lte: date },
      endtime: { $gte: date }
    });

    if (!programme) {
      throw new Error("Programme doesn't exist at given date")
    }

    const allowedDays = (x * 7)
    const day = getDayName(date.getUTCDay());
    const diff = Math.ceil((new Date(programme.starttime) - new Date()) / 86400000); //wyświetlamy 2 tygodnie, ale nie można zmieniać na 3 tyg do przodu
    if (diff <= allowedDays) {
      throw new Error(`It is less than ${allowedDays} days from current date, so you cannot delete a scheduled seanse`)
    }
    let notFound = true
    const seanses = programme.days[day].seanses;
    for (let i = 0; i < seanses.length; i++) {
      if (seanses[i]._id.equals(req.body.seanseid)) {
        seanses.splice(i, 1);
        await programme.save();
        notFound = false
        break;
      }
    }
    if (notFound) {
      throw new Error("Seanse of given id not found on provided date")
    }
    res.status(200).json({ programme: programme });
  }
  catch (err) {
    res.status(400).json({ message: err.message })
  }
}


export { addSeanse, addProgramme, getSeancesOfTheWeek, deleteSeanse, getSeanseAvaiability, getProgrammeForXWeeksAheadPopulated }