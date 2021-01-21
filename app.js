const fs = require("fs");
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const MONGODB_URL =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hfwtj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/users", usersRoutes);

app.use("/api/places", placesRoutes);

// Error hanlding for unsupported routes
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

// Error handling middleware after the routes
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(5000);
    console.log("Connected to database!");
  })
  .catch((err) => {
    console.log(err);
  });
