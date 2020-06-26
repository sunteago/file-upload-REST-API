const router = require("express").Router();
const { uploadFile, downloadFile , deleteFile} = require("../controllers/filesController");
const authMiddleware = require("../middleware/auth");


router.post("/", authMiddleware, uploadFile);


router.get('/:file', downloadFile, deleteFile)
module.exports = router;
