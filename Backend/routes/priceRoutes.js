import express from "express";
import { getPriceList } from "../controllers/priceController.js";
import { get } from "mongoose";


const router = express.Router()

router.get('/', getPriceList)

// GET // localhost: 8000 / api / price  -> current priceList

export default router