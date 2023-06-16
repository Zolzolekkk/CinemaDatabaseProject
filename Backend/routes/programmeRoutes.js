import { addSeance, addProgramme, getSeancesOfTheWeek, deleteSeanse } from "../controllers/programmeController.js"
import express from "express"

const router = express.Router()

router.post("/addProgramme", addProgramme)
router.post("/addSeanse", addSeance)
router.post("/getSeansesWeekly", getSeancesOfTheWeek)
router.post("/deleteSeanse", deleteSeanse)


export default router