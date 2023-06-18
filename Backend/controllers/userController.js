import User from "../model/user.js"
import mongoose from "mongoose";
import { ObjectId } from "mongoose"
// import bcrypt from 'bcrypt';

const generateHash = async (plaintextPassword) => {
  const saltRounds = 10;
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(plaintextPassword, salt);
    return hash;
  } catch (error) {
    // Handle the error
    throw new Error("Error in generating hash for password");
  }
};

const comparePasswords = async (plaintextPassword, storedHash) => {
  try {
    const result = await bcrypt.compare(plaintextPassword, storedHash);
    return result;
  } catch (error) {
    // Handle the error
    throw new Error("Incorrect password!");
  }
};


// req.body= {name:, surname:, email:, password: } - admin default false -> recznie ewentualnei zmiana na true
const registerUser = async (req, res) => { //email na razie (ew. hasło etc.)
  // console.log(req.body)
  try {
    const user = await User.find({ email: req.body.email }) //źle złożonościowo, ale można to skrócić
    if (user.length !== 0) {
      throw new Error("User with given email already exists")
    }
    if (!req.body.password || !req.body.name || !req.body.surname) {
      throw new Error("Not full data about new client has been provided")
    }
    const hashedPassword = await generateHash(req.body.password)
    // console.log(`Hashed password ${hashedPassword}`)
    const data = new User({ ...req.body, password: hashedPassword, tickets: [] })

    const datatoSave = await data.save()
    // console.log("User created succesfully")
    res.status(200).json({ user: { id: datatoSave._id, email: datatoSave.email, name: datatoSave.name, surname: datatoSave.surname } })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

const loginUser = async (req, res) => {
  // console.log(req.body)
  const { email, password } = req.body
  if (!email || !password) {
    throw new Error("Email or password hashnt been specified")
  }
  try {
    const foundUser = await User.findOne({ email: email })
    if (!foundUser) {
      throw new Error("User of given email doesnt exist")
    }
    const passwordsMatch = await comparePasswords(password, foundUser.password)
    if (!passwordsMatch) {
      throw new Error("Incorrect password for given email")
    }
    res.status(200).json({ user: { email: foundUser.email, id: foundUser._id, name: foundUser.name, surname: foundUser.surname } })
  }
  catch (err) {
    res.status(400).json({ message: err.message })
  }
}


// userid
const getUserTickets = async (req, res) => { //userid
  const ObjectId = mongoose.Types.ObjectId;
  try {
    const user = await User.findById(new ObjectId(req.body.userid));
    if (!user) {
      throw new Error("User of given Id does not exist")
    }
    // console.log(user.tickets);
    res.status(200).json({ tickets: user.tickets });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}



export { registerUser, getUserTickets, loginUser };