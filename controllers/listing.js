const Listing = require("../models/listings.js");
const { cloudinary } = require("../cloudconfig.js");
// If Node version < 18, uncomment the line below:
// const fetch = require("node-fetch");

async function getCoordinates(location) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`,
      { headers: { "User-Agent": "WanderLust-App" } },
    );
    const data = await response.json();
    if (data.length === 0) return null;
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  } catch (err) {
    console.log("Geocoding error:", err);
    return null;
  }
}

// ALL LISTINGS (home.ejs)
module.exports.home = async (req, res) => {
  const { category } = req.query;
  let filter = {};

  // Only filter if category is passed AND is not empty
  if (category && category.trim() !== "") {
    filter.category = category;
  }

  const allListings = await Listing.find(filter);

  // Terminal Logging for Verification
  console.log(
    `[DEBUG] Category: "${category || "All"}" | Total Listings Found: ${allListings.length}`,
  );

  res.render("listings/home.ejs", {
    all_listings: allListings,
    currentCategory: category,
  });
};

// NEW LISTINGS (new.ejs)
module.exports.newListingForm = async (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.newListing = async (req, res) => {
  const url = req.file.path;
  const filename = req.file.filename;

  const coords = await getCoordinates(req.body.listing.location);

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  if (coords) {
    newListing.geometry = {
      type: "Point",
      coordinates: [coords.lon, coords.lat],
    };
  }

  await newListing.save();

  req.flash("success", "New listing created!");
  res.redirect("/listings");
};

// EDIT LISTINGS (edit.ejs)
module.exports.editListingForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing doesn't exists");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { list: listing });
};

module.exports.editListing = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body.listing;

  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing doesn't exist!");
    return res.redirect("/listings");
  }

  // Agar location change hui hai, to naye coordinates lo
  if (updatedData.location !== listing.location) {
    const coords = await getCoordinates(updatedData.location);
    if (coords) {
      listing.geometry = {
        type: "Point",
        coordinates: [coords.lon, coords.lat],
      };
    }
  }

  Object.assign(listing, updatedData);

  if (typeof req.file !== "undefined") {
    if (listing.image.filename !== "listingimage") {
      await cloudinary.uploader.destroy(listing.image.filename);
    }
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await listing.save();

  req.flash("success", "Listing edited successfully");
  res.redirect(`/listings/${id}`);
};

// SHOW LISTINGS (detail.ejs)
module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing doesn't exists");
    return res.redirect("/listings");
  }
  res.render("listings/detail.ejs", { list: listing });
};

// DELETE LISTING
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  const listing_to_delete = await Listing.findById(id);

  if (!listing_to_delete) {
    req.flash("error", "Listing doesn't exist !");
    return res.redirect("/listings");
  }

  if (listing_to_delete.image.filename !== "listingimage") {
    await cloudinary.uploader.destroy(listing_to_delete.image.filename);
  }

  const deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);

  req.flash("success", "List Deleted successfully");
  res.redirect("/listings");
};
