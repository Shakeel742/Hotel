const express = require("express");
const app = express();
const router = require("./routes/index");
const layouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const User = require("./models/user");
const connectFlash = require("connect-flash");
const expressValidator = require("express-validator");

app.use(methodOverride("_method", { methods: ["POST", "GET"] }));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/hotel", {
  useNewUrlParser: true
});

mongoose.Promise = global.Promise;

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(express.json());
app.use(layouts);
app.use(express.static("public"));

app.use(cookieParser("secret123"));
app.use(
  expressSession({
    secret: "secret123",
    cookie: {
      maxAge: 4000000
    },
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(connectFlash());

app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
});

app.use(expressValidator());

app.use("/", router);

app.listen(app.get("port"), () => {
  console.log(`app listening on port ${app.get("port")}`);
});
