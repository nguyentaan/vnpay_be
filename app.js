const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const order = require("./routes/order");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000; // Use PORT environment variable or default to 3000
const serverAddress = process.env.SERVER_ADDRESS || "http://localhost";
const pathUrl = `${serverAddress}:${port}`;

// Middleware to set headers
app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', "geolocation 'self'; microphone 'none'");
  res.setHeader('Content-Security-Policy', "default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:");
  next();
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/order", order);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// Log the port to the console
app.listen(port, () => {
  console.log(`Server is running on ${pathUrl}`);
});

module.exports = { app, port }; // Export the app and port
