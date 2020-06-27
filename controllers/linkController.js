const Link = require("../models/Link");
const shortid = require("shortid");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

exports.newLink = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { filename, name } = req.body;

  const link = new Link();
  link.url = shortid.generate();
  link.name = name;
  link.filename = filename;

  if (req.user) {
    const { password, downloads } = req.body;

    if (downloads) {
      link.downloads = parseInt(downloads);
    }

    if (password) {
      const hashedPw = await bcrypt.hash(password, 12);
      link.password = hashedPw;
    }
    link.author = req.user.id;
  }
  try {
    await link.save();
    return res.json({ msg: `${link.url}` });
  } catch (err) {
    console.log(err);
  }
};

exports.hasPassword = async (req, res, next) => {
  const url = req.params.url;
  const link = await Link.findOne({ url });

  if (!link) {
    res.status(404).json({ msg: "Invalid or deleted link" });
    return next();
  }
  if (link.password) {
    return res.json({ password: true, link: link.url });
  }
  next();
};

exports.validatePassword = async (req, res, next) => {
  const { url } = req.params;
  const { password } = req.body;

  const link = await Link.findOne({ url });

  const correctPassword = await bcrypt.compare(password, link.password);
  if (correctPassword) {
    next();
  } else {
    return res.status(403).json({ msg: "Incorrect Password" });
  }

};

exports.getLink = async (req, res, next) => {
  const url = req.params.url;
  const link = await Link.findOne({ url });

  if (!link) {
    res.status(404).json({ msg: "Invalid or deleted link" });
    return next();
  }

  res.json({ file: link.name, password: false, filename: link.filename});
};

exports.getLinks = async (req, res) => {
  try {
    const links = await Link.find({}).select("url -_id");
    res.json({ links });
  } catch (err) {
    console.log(err);
  }
};
