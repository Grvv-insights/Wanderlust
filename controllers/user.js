const User = require("../models/users.js");
const Review = require("../models/review");
const Listing = require("../models/listing");
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
module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back to Wanderlust!");

  // Handle pending review auto-submission if present
  if (req.session.pendingReview) {
    const listingId = redirectUrl.split("/").pop(); // URL se listing ID nikaलो
    const listing = await Listing.findById(listingId);

    try {
      const newReview = new Review(req.session.pendingReview);
      newReview.author = req.user._id;

      listing.reviews.push(newReview);
      await newReview.save();
      await listing.save();

      req.flash("success", "Review posted automatically!");
      return res.redirect(`/listings/${listingId}`);
    } catch (err) {
      console.error("Auto-review error:", err);
    }
    delete req.session.pendingReview;
  }

  // Fallback to standard redirect
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