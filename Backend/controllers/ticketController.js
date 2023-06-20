import Programme from "../model/programme.js";
import Movie from "../model/movie.js";
import Room from "../model/room.js";
import User from "../model/user.js";
import mongoose from "mongoose";
import { ObjectId } from "mongoose";

const dayNames = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const getDayName = (number) =>
  number !== 0 ? dayNames[number - 1] : "sunday";

//tod: controllerPrices
const testAddTicket = async (req, res) => {
  //seanceid, normalny czy ulgowy (type), email, dzień tygodnia/data dnia tygodnia filmu (date), row, col, price, is3d
  const ObjectId = mongoose.Types.ObjectId;
  //todo: klient podaje maila, nawet jak ma hasło to i tak podpinamy pod jego maila w bazie (zmienić to)
  try {
    //check if programme exist
    const date = new Date(req.body.date);
    const programme = await Programme.findOne({
      starttime: { $lte: date },
      endtime: { $gte: date },
    });

    if (!programme) {
      throw new Error(
        "Programme doesn't exist at given date"
      );
    }
    await Programme.populateQuery(programme);
    let user;
    let ticket;
    //user actions
    if (req.body.email) {
      // niezalogowany, sprawdzić bazę
      const email = req.body.email;
      user = await User.findOne({ email: email });
      console.log(user);
      if (user) {
        //użytkownik w bazie, sprawdź, czy jest zarejestrowany
        if (user.password) {
          //zarejestrowany, a nie zalogowany, zaloguj się
          throw new Error("To buy a ticket please login");
        } else {
          //get userid
          const userid = user._id;
        }
      } else {
        //nie ma użytkownika, dodaj nowego
        const data = new User({
          email: email,
          name: req.body.name,
          surname: req.body.surname,
          password: null,
          admin: false,
          tickets: [],
        });
        user = await data.save();
        const userid = user._id;
      }
    } else if (req.body.userid) {
      //użytkownik zalogowany
      user = await User.findById(
        new ObjectId(req.body.userid)
      );
      if (!user) {
        throw new Error("User doesn't exist");
      }
      const userid = req.body.userid;
      const email = user.email;
    } else {
      throw new Error(
        "Neither userid nor email provided, cannot anonimous buy ticket"
      );
    }

    const day = getDayName(date.getUTCDay());
    const seanses = programme.days[day].seanses;
    let seanseFound = null;
    for (let seanse of seanses) {
      if (seanse._id.equals(req.body.seanseid)) {
        seanseFound = seanse;
        break;
      }
    }
    if (!seanseFound) {
      throw new Error("Seanse doesn't exist");
    }
    const movie = seanseFound.movieid;
    const room = seanseFound.room;
    const moviedate = seanseFound.starttime;
    const moviename = movie.title;
    const is3d = seanseFound['3d'];
    const seanseid = seanseFound._id;
    // const is3d = req.body.is3d;
    const roomnumber = room.number;
    const row = req.body.row;
    const col = req.body.col;
    const colCount = room.cols;
    // const seatnumber = row * colCount + col;


    if (!seanseFound.seats[row]) {
      throw new Error(`Row number ${row} doesn't exist`);
    }

    if (!seanseFound.seats[row].seats[col]) {
      throw new Error(
        `Col number ${col} doesn't exist in row number ${row}`
      );
    }
    const seatnumber = seanseFound.seats[row].seats[col].number;

    // if (
    //   seanseFound.seats[row].seats[col].number != seatnumber
    // ) {
    //   throw new Error("Invalid seatnumber");
    // }

    console.log(row);
    console.log(col);
    console.log(seanseFound.seats[row].seats[col].availability);
    if (seanseFound.seats[row].seats[col].availability == false) {
      throw new Error(
        "This place isn't available, choose another one"
      );
    }

    //update availability
    seanseFound.seats[row].seats[col].availability = false;
    await programme.save();
    //add ticket in both places using transactions
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      ticket = {
        id: new mongoose.Types.ObjectId(),
        userid: user._id,
        programmeid: programme._id,
        seanseid: seanseid,
        price: req.body.price,
        type: req.body.type,
        movieinfo: {
          moviename: moviename,
          moviedate: moviedate,
          "3d": is3d,
          seatinfo: {
            room: roomnumber,
            row: row,
            seat: seatnumber,
          },
        },
      };
      seanseFound.tickets.push(ticket);
      user.tickets.push(ticket);
      await user.save();
      await programme.save();
      await session.commitTransaction();
      session.endSession();
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      seanseFound.seats[row].seats[col].availability = true;
      await programme.save();
    }
    res.status(200).json({ ticket: ticket });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export { testAddTicket };

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



