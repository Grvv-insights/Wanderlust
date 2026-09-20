const User = require("../models/users.js");

//SIGNUP FORM
module.exports.signupForm = (req, res) => {
  res.render("users/signup.ejs");
};

//SIGNUP
module.exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email });

    // Register user in DB with Passport Local Mongoose
    const registeredUser = await User.register(newUser, password);
    console.log("Registered User:", registeredUser);

    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to WanderLust!");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

//LOGIN FORM
module.exports.loginForm = (req, res) => {
  res.render("users/login.ejs");
};
//LOGIN
module.exports.login = (req, res) => {
  req.flash("success", "Welcome back to WanderLust!");

  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

//LOGOUT
module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "You've been successfully logout");
    res.redirect("/listings");
  });
};