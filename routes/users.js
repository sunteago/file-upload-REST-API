const router = require("express").Router();
const { createUser } = require("../controllers/userController");
const { check } = require("express-validator");

router.post(
  "/",
  [
    check("name", "Name is Required").not().isEmpty(),
    check("email", "Email is required").isEmail(),
    check("password", "Password too short").isLength({ min: 6 }),
  ],
  createUser
);

module.exports = router;
