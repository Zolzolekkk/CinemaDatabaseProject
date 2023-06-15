import User from "../model/user.js"

const addUser = async (req, res) => {
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


export { addUser };