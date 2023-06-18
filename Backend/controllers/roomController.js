import express from "express"
import Room from "../model/room.js"

const addRoom = async (req, res) => {
  try {
    const room = await Room.findOne({ number: req.body.number })
    if (room) {
      throw new Error("Room of given number already exists")
    }
    const data = new Room(req.body)
    const datatoSave = await data.save()
    res.status(200).json({ room: datatoSave })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

const getRooms = async (req, res) => {
  try {
    const datatoSave = await Room.find({})
    res.status(200).json({ rooms: datatoSave })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export { addRoom, getRooms }