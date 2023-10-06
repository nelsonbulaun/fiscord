var createError = require("http-errors");
var express = require("express");
var cors = require("cors");
const app = express();
var path = require("path");
require("dotenv").config();
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var indexRouter = require("./routes/index");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
// const dbname = "fiscord";
const User = require("./models/User");
const http = require("http");
const server = http.createServer(app);
const socketIO = require("./controllers/socketController");
const io = socketIO(server);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const mongoDb = (process.env.MONGODB_API);
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

var indexRouter = require("./routes/index");

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    cookie: {
      expires: 60 * 60 * 24,
      httpOnly: false,
    },
  })
);
app.use(cookieParser("secret"));
app.use(
  cors({
    origin: "https://nelsonbulaun.github.io", // <-- location of the react app were connecting to
    credentials: true,
    methods: ['GET', 'POST'],
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

require("./passportConfig")(passport);

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.message);
});

const PORT = process.env.PORT || 8080;


server.listen(PORT, console.log(`Server started on port ${PORT}`));
