const User = require("../models/User");
const bcrypt = require("bcrypt");
const {validationResult} = require('express-validator');

exports.createUser = async (req, res, next) => {
  const { name, password, email } = req.body;
    
  const errors = validationResult(req) ;
  if(!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()})
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ msg: "User already in DB" });
  }

  const hashedPw = await bcrypt.hash(password, 12);

  try {
    const user = await new User({ email, password: hashedPw, name });
    await user.save();
    res.json({ msg: "User created" });
  } catch (err) {
    console.log(err);
  }
};