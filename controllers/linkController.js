const Link = require("../models/Link");
const shortid = require("shortid");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

exports.newLink = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { filename } = req.body;

  const link = new Link();
  link.url = shortid.generate();
  link.name = shortid.generate();
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

exports.getLink = async (req,res,next) => {
    const url = req.params.url;
    const link = await Link.findOne({url});

    if(!link) {
        res.status(404).json({msg: 'Invalid or deleted link'});
        return next();
    }

    res.json({file: link.name});

    const {downloads, name} = link;

    if(downloads === 1) {
        req.file = name;
        await Link.findOneAndRemove(url);
        next();
    } else {
        link.downloads--;
        await link.save();
    }
};

