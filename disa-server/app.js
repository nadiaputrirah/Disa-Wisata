var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
const log = require("./middlewares/logger");
var logger = require("morgan");
const cors = require("cors");
const { decodeToken } = require("./middlewares/index");

const authRouter = require("./routes/auth");
const destinasiPopuler = require("./models/destinasiPopuler");
const informasiTerkini = require("./models/informasiTerkini");
const berbagiDestinasi = require("./models/berbagiDestinasi");
const ulasan = require("./models/ulasan");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.set("view engine", "pug");

app.use(cors());
app.use(decodeToken());
app.use(log);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/auth", authRouter);
app.use("/api", destinasiPopuler);
app.use("/api", informasiTerkini);
app.use("/api", berbagiDestinasi);
app.use("/api", ulasan);
// app.use("/", indexRouter);
// app.use("/users", usersRouter);

app.use("/", (req, res) => {
  res.render("index", { title: "POS API" });
});

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
  res.render("error");
});

module.exports = app;
