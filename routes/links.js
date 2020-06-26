const router = require("express").Router();
const { newLink, getLink, getLinks } = require("../controllers/linkController");
const { check } = require("express-validator");
const authMiddleware = require("../middleware/auth");

router.post('/',
    authMiddleware,
    check('name', 'Upload a file').not().isEmpty(),
    check('filename', 'Upload a file').not().isEmpty(),
    newLink
);

router.get('/',
    getLinks
)

router.get('/:url', getLink)

module.exports = router;