import Programme from "../model/programme.js"
import Movie from "../model/movie.js"
import Room from "../model/room.js"
import mongoose from "mongoose";
import { ObjectId } from "mongoose"

//programme przyjmuje starttime, endtime (w tym dzikim formacie daty)
const addProgramme = async (req, res) => { //to do: czy seanse na siebie nie nachodzą w danym roomie i w danych tygodniach
  //todo: czy to jest tydzień, czyli od ponedziałku do niedzieli
  console.log(req.body)
  try {
    const starttime = new Date(req.body.starttime);
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
      throw new Exception("Programme doesn't exist");
    }
    // console.log(programme.starttime)
    // console.log(programme.endtime)
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
    // const singleSeance = mongoose.model("singleSeance", singleSeance);
    // const seance = new singleSeance({
    //   movieid: new ObjectId(req.body.movieid), //todo: check if movie exists
    //   "3d": req.body.is3d,
    //   room: new ObjectId(req.body.room),
    //   starttime: starttime,
    //   endtime: endtime,
    //   seats: seats,
    //   tickets: []
    // });

    //checking if movie exists
    const movie = await Movie.findById(new ObjectId(req.body.movieid));

    if (!movie) {
      throw new Exception("Movie doesn't exist");
    }

    const seance = {
      movieid: movieId, //todo: check if movie exists - done
      "3d": req.body.is3d,
      room: new ObjectId(req.body.room),
      starttime: starttime,
      endtime: endtime,
      seats: seats,
      tickets: []
    };

    var dayNames = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    console.log(day);
    console.log(programme.days[dayNames[day]]);
    console.log(programme.days[dayNames[day]].seanses);
    programme.days[dayNames[day]].seanses.push(seance);
    const updatedProgramme = await programme.save();
    console.log("Seance added successfully:", updatedProgramme);
    res.json(updatedProgramme);
  } catch (err) {
    console.error("Error adding programme:", err);
    res.json({ message: err.message })
  }
};


export { addSeance, addProgramme }