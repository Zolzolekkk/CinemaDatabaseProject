import { addSeanse, addProgramme, getSeancesOfTheWeek, deleteSeanse, getSeanseAvaiability, getProgrammeForXWeeksAheadPopulated } from "../controllers/programmeController.js"
import express from "express"

const router = express.Router()

router.post("/addProgramme", addProgramme)
router.post("/addSeanse", addSeanse)
router.post("/getProgramme", getSeancesOfTheWeek)
router.get("/getProgrammesWeekly", getProgrammeForXWeeksAheadPopulated)
router.post("/seansesAvailability", getSeanseAvaiability)
router.post("/deleteSeanse", deleteSeanse)


// Add programme localhost:8000/api/programmes/addProgramme
// {
//     "starttime": "2023-06-26T17:30:00.000+00:00",
//     "endtime": "2023-07-02T02:30:00.000+00:00"
// } -> returns added programme { programme : programme } or 404 error with message

// Add Seanse localhost:8000/api/programmes/addSeanse
// {
//     "date": "2023-07-15T12:30:00.000+00:00",
//     "room": "648ba3640e0fd1e176b71631",
//     "starttime" : "2023-07-15T12:30:00.000+00:00",
//     "endtime": "2023-07-15T14:30:00.000+00:00",
//     "is3d": false,
//     "movieid": "645804cd9bbe2826034dbaad"
// } -> returns added seanse and current programme { programme : programme , seanse: seanse} or 404 error with message

// get Programme for given Date localhost:8000/api/programmes/getProgramme
// { date: date}
//  -> {programme: programme} dla tygodnia w ktorym zawiera sie ta data (z wypelnionymi polami movieid jako dokument movie i odpowiednio room jako dokument room o odpowiednim ID)


// GET  get array of programmes for next x weeks (next x programmes counting current one as well) (x variable in module programmeController.js) localhost:8000/api/programmes/getProgrammesWeekly x set to 3 currently
//  -> {programmes: [programme]}

// get 2D array od boolean values indicating row/column of seanse availability localhost:8000/api/programmes/seansesAvailability
// {
//     "programmeId": "648efed2c8a65afb28685236" ,
//     "date": "2023-07-03T08:30:00.000+00:00",
//     "seanseid": "648f270828678427b7195777"
// } -> { seats: [[Boolean]] }

// localhost:8000/api/programmes/deleteSeanse
// // {
//     "date": "2023-07-03T12:50:00.000+00:00",
//     "seanseid": "648f270828678427b7195777"
// } -> return current programme { programme : programme }

export default router