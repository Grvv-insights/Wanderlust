const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const { listingSchema } = require("../listing_schema.js");

const { isLoggedIn, isOwner } = require("../middleware.js");

const listingController=require("../controllers/listing.js")

const multer= require("multer")
const {storage}=require("../cloudconfig.js")
const upload = multer({ storage });

// MIDDLEWARES
const validateListing = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new ExpressError(400, "Request body cannot be empty");
  }
  const { error } = listingSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((element) => element.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  next();
};

// LISTINGS ROUTES

// All Listings Route
router.get("/",wrapAsync(listingController.home));

// NEW Route
router.get("/new",isLoggedIn("You Must be logged in to Create the listing"),
wrapAsync(listingController.newListingForm));

router.post("/",
  isLoggedIn("You must be logged in to Create a listing"),
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.newListing),
);

// Update Route
router.get("/:id/edit",
  isLoggedIn("You Must be logged in to Edit the listing"),
  isOwner,
  wrapAsync(listingController.editListingForm),
);

router.put(
  "/:id",
  isLoggedIn("You must be logged in to edit a listing"),
  isOwner,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.editListing),
);

// Show Route (READ)
router.get("/:id",
  wrapAsync(listingController.showListing),
);

// Delete Route
router.delete("/:id",
  isLoggedIn("You Must be logged in to Delete the listing"),
  isOwner,
  wrapAsync(listingController.deleteListing),
);

module.exports = router;
