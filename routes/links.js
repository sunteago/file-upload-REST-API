const router = require("express").Router();
const { newLink, getLink } = require("../controllers/linkController");
const { check } = require("express-validator");
const authMiddleware = require("../middleware/auth");
const {deleteFile} = require('../controllers/filesController');

router.post('/',
    authMiddleware,
    check('name', 'Upload a file').not().isEmpty(),
    check('filename', 'Upload a file').not().isEmpty(),
    newLink
);

router.get('/:url', getLink, deleteFile)

module.exports = router;