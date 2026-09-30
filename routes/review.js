const express = require("express");
const router = express.Router({mergeParams:true});

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const { reviewSchema } = require("../listing_schema.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");

const reviewController = require("../controllers/review.js");

// MIDDLEWARES
const validateReview = (req, res, next) => {
  console.log(req.body);
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new ExpressError(400, "Request body cannot be empty");
  }

  const { error } = reviewSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((element) => element.message).join(",");
    throw new ExpressError(400, errMsg);
  }

  next();
};

//____________REVIEWS ROUTES_______________

// Post Route for form
router.post(
  "/",
  (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.session.redirectUrl = `/listings/${req.params.id}`;
      if(req.body && req.body.review){
        req.session.pendingReview={
          data:req.body.review,
          listingId:req.params.id
        };
      }
    }
    next();
  },
  isLoggedIn("You must be logged in to leave a review"),
  validateReview,
  wrapAsync(reviewController.addReview),
);

router.delete(
  "/:reviewId",
  isLoggedIn(),
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview),
);

module.exports = router;
