const express = require("express");
const router = express.Router();

const passport = require("passport");

const User = require("../models/users.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl }=require("../middleware.js");
const userController = require("../controllers/user.js");

router.get("/signup",userController.signupForm);

router.post("/signup",wrapAsync(userController.signup));

router.get("/login",userController.loginForm);

router.post("/login",saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
userController.login,
);

router.get("/logout",userController.logout)

module.exports = router;
