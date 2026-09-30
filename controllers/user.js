const User = require("../models/users.js");
const Review = require("../models/review");
const Listing = require("../models/listing");
const { reviewSchema } = require("../schema.js");

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
const Listing = require("../models/listings.js");
const Review = require("../models/reviews.js");
const { reviewSchema } = require("../schema.js"); // Your Joi validation schema

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back to WanderLust!");

  let redirectUrl = res.locals.redirectUrl || "/listings";

  // Handle Pending Review if user tried submitting while logged out
  if (req.session.pendingReview) {
    const { data, listingId } = req.session.pendingReview;
    delete req.session.pendingReview; // Cleanup session immediately to prevent duplicate runs

    try {
      // 1. Validate Review Data against Joi Schema
      const { error } = reviewSchema.validate({ review: data });
      if (error) {
        throw new Error("Invalid review data format.");
      }

      // 2. Validate Listing ID presence
      if (!listingId) {
        throw new Error("Target listing ID not found.");
      }

      // 3. Fetch Listing
      const listing = await Listing.findById(listingId);
      if (!listing) {
        throw new Error("Target listing does not exist.");
      }

      // 4. Save New Review
      const newReview = new Review(data);
      newReview.author = req.user._id;

      listing.reviews.push(newReview);
      await newReview.save();
      await listing.save();

      req.flash("success", "Your review has been automatically submitted!");
      return res.redirect(`/listings/${listingId}`);
    } catch (err) {
      console.error("Auto-review submission error:", err.message);
      req.flash(
        "error",
        "Could not submit review automatically. Please try again.",
      );
      return res.redirect(redirectUrl);
    }
  }

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