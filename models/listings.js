const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: {
      type: String,
      default:
        "https://img.magnific.com/free-vector/glitch-error-404-page_23-2148105404.jpg?semt=ais_hybrid&w=740&q=80",
      set: (v) =>
        v === ""
          ? "https://img.magnific.com/free-vector/glitch-error-404-page_23-2148105404.jpg?semt=ais_hybrid&w=740&q=80"
          : v,
    },
    filename: {
      type: String,
      default: "listingimage",
    },
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
    },
  },
  category: {
    type: String,
    enum: [
      "trending",
      "rooms",
      "iconic-cities",
      "mountains",
      "castles",
      "pools",
      "camping",
      "farms",
      "arctic",
      "domes",
      "boats",
    ],
  },
});

// POST MIDDLEWARE (For DELETING REVIEWS, After LISTING is DELETED)
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing && listing.reviews.length) {
    let res = await Review.deleteMany({ _id: { $in: listing.reviews } });
    console.log("Deleting Listing with its reviews");
    console.log(res);
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
