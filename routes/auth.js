const router = require("express").Router();
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../model/User");
const { registerValidation, loginValidation } = require("../validation");

// POST: REGISTER
router.post("/register", async (req, res) => {
  //VALIDATE
  const { error } = registerValidation(req.body);

  // REGISTRATION VALID. FAILED
  if (error) {
    res.status(400).send(error.details[0].message); //returns
  }

  // check if email already exists
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) {
    return res.status(400).send("Email already exists");
  }

  //HASH THE PASSWORD
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // CREATE USER
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    const savedUser = await user.save(); // SAVE to DB
    res.json({ user: savedUser._id }); // send ID only
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

// POST: LOGIN
router.post("/login", async (req, res) => {
  // validation
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if Email exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email not Found");

  // VERIFY PASSWORD
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Incorrect Password");

  // CREATE AND ASSIGN TOKEN
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token); // after loggin send token to client
});

module.exports = router;
