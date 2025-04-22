// import necessary file and packages
const layouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const User = require("./models/user");
const methodOverride = require("method-override");
const expressSession = require("express-session");
const connectFlash = require("connect-flash");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
const passport = require("passport");
const router = require("./routes/index");
const express = require("express");
const app = express();



// Check if we're in production or development
const dbURI = process.env.NODE_ENV === "production" 
? process.env.MONGO_URI // Use the MongoDB URI from environment variable (production)
: "mongodb://localhost:27017/Brandeis_SAA"; // Local development DB

mongoose.connect(dbURI, {
useNewUrlParser: true,
useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once("open", () => {
console.log("Connected to the database!");
});

db.on("error", (err) => {
console.error("Database connection error:", err);
});
// set up express app
app.set("port", process.env.PORT || 8080);
app.set("view engine", "ejs");

// create an instance of the Express Router
//const router = express.Router();

//use cookie to handel flash message
app.use(connectFlash());
app.use(
  expressSession({
    secret: "secret_passcode",
    cookie: { maxAge: 4000000 },
    resave: false,
    saveUninitialized: false,
  })
);
app.use(cookieParser("secret_passcode"));


app.use(layouts);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride("_method", { methods: ["POST", "GET"] }));
//app.use(connectFlash());


app.use(expressValidator());
app.use(passport.initialize()); 
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//set up flash message
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
});


// Use the router for the routes
app.use("/", router);



//server is connected and displayed
const server = app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});

const io = require("socket.io")(server);
require("./controllers/chatController")(io);

