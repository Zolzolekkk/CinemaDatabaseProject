import { addSeance, addProgramme } from "../controllers/programmeController.js"
import express from "express"

const router = express.Router()

router.post("/addProgramme", addProgramme)
router.post("/addSeanse", addSeance)

export default router