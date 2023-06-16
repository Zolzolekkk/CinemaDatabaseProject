import Room from "../model/room.js"
import User from "../model/user.js"
import Programme from "../model/programme.js"
import singleSeance from "../model/singleSeance.js"
import Movie from "../model/movie.js"
import { ObjectId } from "mongoose"
import mongoose from "mongoose"

const testPost = async (req, res) => { //chcemy dostawać id roomu, a jeśli nie, to msuimy po jego numerze znaleźć
  console.log(req.body)
  const room = await Room.find({ number: req.body.number })
  console.log(room)
  if (room.length !== 0) {
    return res.status(400).json({ message: "Room of given number already exists" })
  }
  const data = new Room(req.body) //to do: trigger sprawdzający czy pokój o danym numerze nie istnieje 
  try {
    const datatoSave = await data.save()
    res.status(200).json(datatoSave)
    console.log("Udało sie : ) ")
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}


const testGet = async (req, res) => {
  // console.log(req.body)
  // const data = new Room(req.body)
  try {
    const datatoSave = await Room.find()
    res.status(200).json(datatoSave)
    console.log("Udało sie : ) ")
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

const testPostProgramme = async (req, res) => {
  console.log(req.body)
  const data = new Programme(req.body)
  try {
    const datatoSave = await data.save()
    res.status(200).json(datatoSave)
    console.log("Udało sie dodac program : ) ")
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

//programme przyjmuje starttime, endtime (w tym dzikim formacie daty)
const addProgrammeTest = async (req, res) => { //to do: czy seanse na siebie nie nachodzą w danym roomie i w danych tygodniach
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

// 648b480816790d34c966f4a8 - room

// 645804cd9bbe2826034dbaa6 - movie

const addSeanceTest = async (req, res) => { //date, room (id), starttime, endtime, is3d, movieid 
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
    console.log("BEFORE MOVIE ")
    // const movie = await Movie.findById(new ObjectId(req.body.movieid));
    // if (!movie) {
    //   throw new Exception("Movie doesn't exist");
    // }

    console.log("Creating seance ")
    const seance = {
      movieid: req.body.movieid, //todo: check if movie exists - done
      "3d": req.body.is3d,
      room: new ObjectId(req.body.room),
      starttime: starttime,
      endtime: endtime,
      seats: seats,
      tickets: []
    };

    var dayNames = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    console.log("WE ARE HEREEEEEEEEEEEE")
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



const testUserPost = async (req, res) => {
  console.log(req.body)
  const user = await User.find({ email: req.body.email }) //źle złożonościowo, ale można to skrócić
  if (user.length !== 0) {
    return res.status(400).json({ message: "User with given email already exists" })
  }
  const data = new User({ ...req.body, tickets: [] })
  try {
    const datatoSave = await data.save()
    res.status(200).json(datatoSave)
    console.log("User created succesfully")
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// const testAddTicket = async (req, res) => { //seanceid, normalny czy ulgowy (type), email, dzień tygodnia/data dnia tygodnia 
//   console.log(req.body)
//   //todo: klient podaje maila, nawet jak ma hasło to i tak podpinamy pod jego maila w bazie (zmienić to)
//   try {
//     const programme = await Programme.findById(new ObjectId(req.body.programmeid));
//     if (!programme) {
//       throw new Exception("Programme doesn't exist");
//     }
//     const seance = await sence.findById(new ObjectId(req.body.room)); //znaleźć seance po id
//     if (!document) {
//       throw new Exception("This room doesn't exist");
//     }
//   } catch (err) {
//     res.status(400).json({ message: err.message })
//   }
// }

export { testPost, testGet, addProgrammeTest, addSeanceTest, testUserPost }

//ticketid uważać, bo się może wygenerować 2 razy

