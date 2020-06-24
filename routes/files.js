const router = require("express").Router();
const { uploadFile, deleteFile } = require("../controllers/filesController");
const authMiddleware = require("../middleware/auth");


router.post("/", authMiddleware, uploadFile);

module.exports = router;
