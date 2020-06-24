const router = require("express").Router();
const { authUser, getAuthUser } = require("../controllers/authController");
const { check } = require("express-validator");
const authMiddleware = require("../middleware/auth");

router.post(
  "/",
  [
    check("email", "Invalid email").isEmail(),
    check("password", "Password cannot be empty").not().isEmpty(),
  ],
  authUser
);

router.get("/", authMiddleware, getAuthUser);

module.exports = router;
