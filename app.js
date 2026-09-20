require("dotenv").config();

const express = require("express");
const app = express();

const ejsmate = require("ejs-mate");

const mongoose = require("mongoose");
const dbUrl = process.env.MONGO_ATLAS_DB_URL;

const path = require("path");
const methodOverride = require("method-override");

const listingsRouter = require("./routes/listing.js"); //for routes
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const ExpressError = require("./utils/ExpressError");

const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/users.js");

app.use(express.json());
app.use(methodOverride("_method"));

app.engine("ejs", ejsmate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));

/*___________________________________________________________*/

main()
  .then(() => {
    console.log("Database Connection Established");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

// Session Middleware
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SESSION_SECRET,
  },
  touchAfter: 24 * 3600,
});
store.on("error",()=>{
  console.log("ERROR in MONGO SESSION STORE",err);
})

const sessionOptions = {
  store, //Internally {store:store}
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, //for 7 days
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, //for security purpose(to save from CROSS-SCRIPTING-ATTACKS)
  },
};

app.use(session(sessionOptions));

//__________PASSPORT______________

//1. Initialize Passport
app.use(passport.initialize());
app.use(passport.session()); // Persistent Login sessions

//2. Configure Local Strategy(login through email and password, TIP u can use other things too like gmail,facebook and all)
passport.use(new LocalStrategy(User.authenticate()));

//3. Serialize & Deserialize User
passport.serializeUser(User.serializeUser()); //Stores the user's ID into the session cookie (keeps session memory lightweight.
passport.deserializeUser(User.deserializeUser()); //Runs on every incoming request, fetches the user details from MongoDB using the session ID, and attaches the user object to req.user.
//________________________________

app.use((req, res, next) => {
  res.locals.successMsg = req.session.success || [];
  res.locals.errorMsg = req.session.error || [];

  delete req.session.success;
  delete req.session.error;

  req.flash = (type, message) => {
    if (!req.session[type]) {
      req.session[type] = [];
    }

    if (message) {
      req.session[type].push(message);
    }

    return req.session[type];
  };

  res.locals.currUser = req.user;
  next();
});

// Using Routes
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

//__________ MIDDLEWARE ROUTES______________

//for all the UNKNOWN ROUTES
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

//Error Handling Middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong" } = err;
  res.status(statusCode).render("listings/error.ejs", { err });
});

// Port Route
app.listen(8080, () => {
  console.log("Server is listening at port 8080");
});
