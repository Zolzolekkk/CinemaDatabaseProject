import Programme from "../model/programme.js"
import Movie from "../model/movie.js"
import Room from "../model/room.js"
import User from "../model/user.js"
import mongoose from "mongoose";
import { ObjectId } from "mongoose"


//tod: controllerPrices
const testAddTicket = async (req, res) => { //seanceid, normalny czy ulgowy (type), email, dzień tygodnia/data dnia tygodnia filmu (date), row, col, price, is3d
  // console.log(req.body)
  const ObjectId = mongoose.Types.ObjectId;
  //todo: klient podaje maila, nawet jak ma hasło to i tak podpinamy pod jego maila w bazie (zmienić to)
  try {
    //check if programme exist
    const date = new Date(req.body.date);
    const programme = await Programme.findOne({
      starttime: { $lte: date },
      endtime: { $gte: date }
    })

    

    console.log(`programme:${programme}`)
    if (!programme) {
      throw new Error("Programme doesn't exist");
    }
    
    let user;
    //user actions
    if (req.body.email) { // niezalogowany, sprawdzić bazę
        console.log(req.body)
        const email = req.body.email;
        user = await User.findOne({ email: email }) 
        console.log(user)
        if (user) { //użytkownik w bazie, sprawdź, czy jest zarejestrowany  
          if (user.password) { //zarejestrowany, a nie zalogowany, zaloguj się
                throw new Error("To buy a ticket please enter your password");
            }
            else { //get userid
                const userid = user._id;
            }
        }
        else { //nie ma użytkownika, dodaj nowego
                const data = new User({
                    email: email,
                    name: req.body.name,
                    surname: req.body.surname,
                    password: null,
                    admin: false,
                    tickets: []
                })
                user = await data.save();
                const userid = user._id;
        }
    }
    else if (req.body.userid) { //użytkownik zalogowany
        user = await User.findById(new ObjectId(req.body.userid));
        if (!user) {
            throw new Error("User doesn't exist");
        }
        const userid = req.body.userid;
        const email = user.email;
    }
    else {
        throw new Error("Sth went wrong");
    }

  
    var dayNames = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const day = date.getDay();
    const seanses = programme.days[dayNames[day]].seanses;
    console.log(seanses)
    let seanseFound = null
    for ( let seanse of seanses  ){
      if (seanse._id.equals(req.body.seanseid)) {
            console.log("We got seanse")
            seanseFound = seanse
            break;
        }
    }
    if (!seanseFound) {
        throw new Error("Seanse doesn't exist")
    }
    const movie = await Movie.findById(seanseFound.movieid)
    const room = await Room.findById(seanseFound.room)
    // console.log(movie)
    // console.log(room)
    // console.log(seanseFound) 
    const moviedate = seanseFound.starttime;
    const moviename = movie.title;
    const roomnumber = room.number;
    
    const row = req.body.row;
    const col = req.body.col;
    const colCount = room.cols
    const seatnumber = row * colCount + col;
    console.log(seatnumber);

    if (!seanseFound.seats[row]) {
        throw new Error("This row doesn't exist");
    }

    if (!seanseFound.seats[row].seats[col]) { 
        throw new Error("This col doesn't exist");
    }

    if (seanseFound.seats[row].seats[col].number != seatnumber) { 
        throw new Error("Invalid seatnumber");
    }

    if (seanseFound.seats[row].seats[col].availability == true) {
        //update availability 
        seanseFound.seats[row].seats[col].availability = false;
        await programme.save();
        console.log(`User : ${user}`)
        //add ticket in both places using transactions
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
          console.log(req.body)
            const ticket = {
              id: new mongoose.Types.ObjectId(),
                userid: user._id, 
                programmeid: programme._id,
                price: req.body.price,
                type: req.body.type,
                movieinfo: {
                    moviename: moviename, 
                    moviedate: moviedate,
                    "3d": req.body.is3d,
                    seatinfo: {
                        room: roomnumber, 
                        row: row,
                        seat: seatnumber
                      }
                }
            };
            console.log(`User : ${user}`)
            console.log(`Current tickets: ${seanseFound.tickets}`)
            seanseFound.tickets.push(ticket);
            user.tickets.push(ticket);
            await user.save();
            await programme.save();
            await session.commitTransaction(); 
            session.endSession();
        }
        catch (error) {
          console.log("Sesja nie udala sie ")
            await session.abortTransaction();
            session.endSession();
            seanseFound.seats[row].seats[col].availability = true;
            await programme.save();
        }
        
    }
    else {
        throw new Error("This place isn't available, choose another one");
    }

    
    // res.status(200).json({ message: "Everything fine" })
    console.log("Object to be sent ...")
    const seanseWithRoomAndMovie = { ...seanseFound, movieid: movie, room: room }
    res.status(200).json(seanseWithRoomandMovie)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export {testAddTicket}

// najpierw sprawdzić, czy dany program i seans istnieją
// *sprawdzić, czy user o podanym mailu istnieje (zapamiętujemy jego UserId)
// jak nie istnieje to go dadajemy
// po date szukamy czy seans istnieje, jeśli istnieje
// pobrać movie name i starttime z danego filmu
// szukamy, czy dane miejsce jest wolne, jesli tak, to od razu zmieniamy availability na false
// jeśli nie, to error, że miejsce zostało zajęte w międzyczasie
// (musimy znaleźć cenę, jeśli endtime to null, to są obecne ceny, sprawdzamy po typie i czy jest 3d) - po stronie frontu wysłać odpowiednią cenę i czy jest 3d
// i możemy już dodać bilet w 2 miejscach
// !!!musi być dodany w dwóch miejscach, a nie tylko w jednym!!!

// *todo: jeśli istnieje i ma hasło w bazie, to zwrócić monit o podanie hasła (zalogowanie)
// potem jak "zaloguje" poda hasło to w req przekazać też hasło, sprawdząć, czy hasło nie jest undefined/null

//jak hasło == null, to brak konta
//jak hasło istnije, to się zarejestrowali

// jezeli gosciu chce kupic bilet przez formularz dla niezalogowanych, to jezeli ma juz konto, zwracamy eror i informacje ze juz ma konto,
// wiec prosze sie zalogowac ?

// {
  // uderid: 
  // .//
// }

// {
// email: 
// }



// id: {
//   type: ObjectId,
//   },
// userId: {
//   type: ObjectId,
// },
// programmeId: {
//   type: ObjectId,
// },
// price: {
//   type: Number,
// },
// room: {
//   type: ObjectId,
// },
// row: {
//   type: Number,
// },
// seat: {
//   type: Number,
// },
// type: {
//   type: String,
//     enum: ['student', 'normal']
// },
// "3d": {
//   type: Boolean,
// },
// buydate: {
//   type: Date,
//     default: Date.now
// },
// moviename: {
//   required: true,
//     type: String
// },
// moviedate: {
//   required: true,
//     type: Date
// }
