const router = require("express").Router();
const authController = require("../controllers/auth");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const multer = require("multer");
const upload = multer();

passport.use(
  new LocalStrategy({ usernameField: "email" }, authController.localStrategy)
);
router.post("/register", upload.none(), authController.register);
router.post("/login", upload.none(), authController.login);
router.post("/logout", upload.none(), authController.logout);
router.get("/me", authController.me);

module.exports = router;
