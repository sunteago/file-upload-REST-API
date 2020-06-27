const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variables.env" });
const { validationResult } = require("express-validator");

exports.authUser = async (req, res, next) => {
  const { email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(401).json({ msg: "Incorrect Password or user does not exist" });
    return next();
  }

  console.log(password, user.password);
  const correctPassword = await bcrypt.compare(password, user.password);
  if (!correctPassword) {
    return res
      .status(401)
      .json({ msg: "Incorrect Password or user does not exist" });
  }

  const token = jwt.sign(
    { name: user.name, id: user._id, email: user.email },
    process.env.SECRET,
    {
      expiresIn: "8h",
    }
  );
  res.json({ token });
};

exports.getAuthUser = async (req, res, next) => {
  res.json({user: req.user});
};
