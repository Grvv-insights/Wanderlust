const Listing = require("./models/listings.js");
const Review=require("./models/reviews.js")
// middleware.js
const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // Save original URL to redirect back after login
    req.session.redirectUrl = req.originalUrl;
    
    // Save review form data if user tried to post a review while logged out
    if (req.body && req.body.review) {
      req.session.pendingReview = {
        data: req.body.review,
        listingId: req.params.id
      };
    }

    req.flash("error", "You must be logged in to leave a review!");
    return res.redirect("/login");
  }
  next();
};

const saveRedirectUrl = (req, res, next) => {
    res.locals.redirectUrl=req.session.redirectUrl;
  next();
};

// REVIEWS
const isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params
    let review=await Review.findById(reviewId);

    if (!review) {
      req.flash("error", "Review does not exist!");
      return res.redirect(`/listings/${id}`);
    }

    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You're not the author of this review")
        return res.redirect(`/listings/${id}`)
    }
    next();
}

// OWNER
const isOwner = async (req, res, next) => {

  let { id } = req.params;
  let listing = await Listing.findById(id);

  // 1. Handle edge case where listing doesn't exist
  if (!listing) {
    req.flash("error", "Listing does not exist!");
    return res.redirect("/listings");
  }
  // 2. Authorization check
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You're not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next()
};

module.exports = {
  isLoggedIn,
  saveRedirectUrl,

  isOwner,
  isReviewAuthor,
};