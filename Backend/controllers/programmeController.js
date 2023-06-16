import Programme from "../model/programme.js"
import Movie from "../model/movie.js"
import Room from "../model/room.js"
import singleSeance from '../model/singleSeance.js';
import mongoose from "mongoose";
import { ObjectId } from "mongoose"

const x = 1;

//programme przyjmuje starttime, endtime (w tym dzikim formacie daty)
const addProgramme = async (req, res) => { //to do: czy seanse na siebie nie nachodzą w danym roomie i w danych tygodniach
  //todo: czy to jest tydzień, czyli od ponedziałku do niedzieli
  console.log(req.body)
  try {
    const starttime = new Date(req.body.starttime); //todo: sprawdzić czy od poniedziałku do niedzieli
    const endtime = new Date(req.body.endtime);
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
    console.log("Programme added successfully:", savedProgramme);
    res.json(savedProgramme);
  } catch (err) {
    console.error("Error adding programme:", err);
    res.json({ message: err.message })
  }
};



const addSeance = async (req, res) => { //date, room (id), starttime, endtime, is3d, movieid 
  console.log(req.body)
  try {
    const ObjectId = mongoose.Types.ObjectId;
    const date = new Date(req.body.date);
    const programme = await Programme.findOne({ //todo: check if exists etc. - done
      starttime: { $lte: date },
      endtime: { $gte: date }
    });
    if (!programme) {
      throw new Exception("Programme doesn't exist"); //todo?: sprawdzić, czy istnieje program, jeśli nie, to stworzyć nowy i dodać seans (startdate poniedziałek, enddate niedziela)
    }

    const day = date.getDay();
    const document = await Room.findById(new ObjectId(req.body.room));
    if (!document) {
      throw new Exception("This room doesn't exist");
    }
    const seats = [];

    for (let row = 1; row <= document.rows; row++) {
      let rowSeats = []
      for (let number = 0; number <= document.cols; number++) {
        rowSeats.push({
          number: document.cols * (row - 1) + number,
          availability: true
        });
      }
      console.log(rowSeats)
      seats.push({
        row: row,
        seats: rowSeats
      })
    }
    console.log(seats);
    const starttime = new Date(req.body.starttime); //todo: check if room isn't occupied for seance time
    const endtime = new Date(req.body.endtime);

    // checking if movie exists
    const movie = await Movie.findById(new ObjectId(req.body.movieid));

    if (!movie) {
      throw new Exception("Movie doesn't exist");
    }

    const seance = {
      movieid: new ObjectId(req.body.movieid), //todo: check if movie exists - done
      "3d": req.body.is3d,
      room: new ObjectId(req.body.room),
      starttime: starttime,
      endtime: endtime,
      seats: seats,
      tickets: []
    };

    var dayNames = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    console.log(day);
    console.log(programme.days[dayNames[day - 1]]);
    console.log(programme.days[dayNames[day - 1]].seanses);
    programme.days[dayNames[day - 1]].seanses.push(seance);
    const updatedProgramme = await programme.save();
    console.log("Seance added successfully:", updatedProgramme);
    res.json(updatedProgramme);
  } catch (err) {
    console.error("Error adding programme:", err);
    res.json({ message: err.message })
  }
};


// getting programme id, seance id, date
const getSeanceAvaiability = async (req, res) => {
  console.log(req.body);
  const date = new Date(req.body.date)

  try {
    const programme = await Programme.findById(req.body.programmeId)


    if (!programme) {
      throw new Error("Programme of given id doesn't exist")
    }
    var dayNames = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const day = date.getDay();
    const seanses = programme.days[dayNames[day - 1]].seanses;
    console.log(seanses)
    let seanseFound = null
    for (let seanse of seanses) {
      if (seanse._id.equals(req.body.seanseid)) {
        console.log("We got seanse")
        seanseFound = seanse
        break;
      }
    }
    if (!seanseFound) {
      throw new Error("No seance of given id")
    }

    const seats = []
    for (const row of seanseFound.seats) {
      row = row.map(el => el.availability)
      seats.append(row)
    }
    console.log(seats)

    res.status(200).json(seats)
  }
  catch {
    res.status(400).json({ message: err.message })
  }


}



const getSeancesOfTheWeek = async (req, res) => { //przesłać current date and current date + 7days
  // console.log(req.body);
  const date = new Date(req.body.date)
  try {
    const programme = await Programme.findOne({
      starttime: { $lte: date },
      endtime: { $gte: date }
    }).populate({
      path: 'days.monday.seanses',
      model: singleSeance,
      populate: [{
        path: 'movieid',
        model: Movie,
        select: 'title genres poster imdbId trailerLink',
      },
      {
        path: 'room',
        model: Room
      }]
    }).populate({
      path: 'days.tuesday.seanses',
      model: singleSeance,
      populate: [{
        path: 'movieid',
        model: Movie,
        select: 'title genres poster imdbId trailerLink',
      },
      {
        path: 'room',
        model: Room
      }]
    }).populate({
      path: 'days.wednesday.seanses',
      model: singleSeance,
      populate: [{
        path: 'movieid',
        model: Movie,
        select: 'title genres poster imdbId trailerLink',
      },
      {
        path: 'room',
        model: Room
      }]
    }).populate({
      path: 'days.thursday.seanses',
      model: singleSeance,
      populate: [{
        path: 'movieid',
        model: Movie,
        select: 'title genres poster imdbId trailerLink',
      },
      {
        path: 'room',
        model: Room
      }]
    }).populate({
      path: 'days.friday.seanses',
      model: singleSeance,
      populate: [{
        path: 'movieid',
        model: Movie,
        select: 'title genres poster imdbId trailerLink',
      },
      {
        path: 'room',
        model: Room
      }]
    }).populate({
      path: 'days.saturday.seanses',
      model: singleSeance,
      populate: [{
        path: 'movieid',
        model: Movie,
        select: 'title genres poster imdbId trailerLink',
      },
      {
        path: 'room',
        model: Room
      }]
    }).populate({
      path: 'days.sunday.seanses',
      model: singleSeance,
      populate: [{
        path: 'movieid',
        model: Movie,
        select: 'title genres poster imdbId trailerLink',
      },
      {
        path: 'room',
        model: Room
      }]
    }).exec();

    if (!programme) {
      throw new Error("Programme doesn't exist")
    }

    // console.log(programme.days.friday.seanses[0]);
    res.status(200).json(programme);
  }
  catch (err) {
    res.status(400).json({ message: err.message })
  }


}


const deleteSeanse = async (req, res) => { // date, seanseid
  console.log(req.body);
  const date = new Date(req.body.date)

  try {
    const programme = await Programme.findOne({
      starttime: { $lte: date },
      endtime: { $gte: date }
    });

    if (!programme) {
      throw new Error("Programme of given id doesn't exist")
    }



    var dayNames = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const day = date.getDay() - 1;
    const allowedDays = (x * 7) - day;

    console.log(allowedDays)
    console.log(programme.starttime)
    const diff = Math.ceil((new Date(programme.starttime) - new Date()) / 86400000); //wyświetlamy 2 tygodnie, ale nie można zmieniać na 3 tyg do przodu
    console.log(diff)
    if (diff <= allowedDays) {
      throw new Error(`It is less than ${allowedDays} days from current date, so you cannot delete a scheduled seanse`)
    }
    const seanses = programme.days[dayNames[day]].seanses;
    console.log(seanses)
    // let seanseFoundId = null
    for (let i = 0; i < seanses.length; i++) {
      if (seanses[i]._id.equals(req.body.seanseid)) {
        console.log("We got seanse")
        // delete seanses[i];
        seanses.splice(i, 1);
        await programme.save();
        break;
      }
    }
    // if (!seanseFound) {
    //   throw new Error("No seance of given id")
    // }



    res.status(200).json(programme);
  }
  catch (err) {
    res.status(400).json({ message: err.message })
  }


}


export { addSeance, addProgramme, getSeancesOfTheWeek, deleteSeanse }