const multer = require("multer");
const shortid = require("shortid");
const fs = require('fs');
const Link = require('../models/Link');

exports.uploadFile = async (req, res, next) => {
  const multerConfig = {
    limits: { fileSize: req.user ? 1024 * 1024 * 10 : 1024 * 1024 },
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, __dirname + "/../uploads");
      },
      filename: (req, file, cb) => {
        const ext = file.originalname.substring(
          file.originalname.lastIndexOf("."),
          file.originalname.length
        );
        cb(null, `${shortid.generate()}.${ext}`);
      },
    }),
  };

  const upload = multer(multerConfig).single("file");

  upload(req, res, async (err) => {
    console.log(req.file);

    if (!err) {
      res.json({ file: req.file.filename });
    } else {
      console.log(err);
      return next();
    }
  });
};

exports.deleteFile = async (req, res, next) => {
    try {
        fs.unlinkSync(__dirname + `/../uploads/${req.file}`);
        console.log('file deleted');
    } catch (err) {
        console.log(err);
    }
};

exports.downloadFile = async (req,res, next) => {
  const {file} = req.params
  const link = await Link.findOne({name: file})
  
  const downloadLink = __dirname + '/../uploads/' + file;
  res.download(downloadLink);  
  
  const {downloads, name} = link;

  if(downloads === 1) {
      req.file = name;
      await Link.findOneAndRemove(link.id);
      next();
  } else {
      link.downloads--;
      await link.save();
  }


}