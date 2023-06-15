import express from "express"
import Room from "../model/room.js"

const addRoom = async (req, res) => { //chcemy dostawać id roomu, a jeśli nie, to msuimy po jego numerze znaleźć
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



const getRooms = async (req, res) => {
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


export { addRoom, getRooms }