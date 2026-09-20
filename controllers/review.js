const Listing=require("../models/listings.js")
const Review=require("../models/reviews.js")

// ADD REVIEW
module.exports.addReview = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  const newReview = new Review(req.body.review);

  newReview.author = req.user._id;
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  console.log(newReview);
  req.flash("success", "Review added successfully");
  res.redirect(`/listings/${req.params.id}`);
};

// DELETE REVIEW
module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });

  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted successfully");
  res.redirect(`/listings/${id}`);
};