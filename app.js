const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const MONGODB_URL =
  "mongodb+srv://MERN-Backend:YnzYmvXSFYYkJuWn@cluster0.hfwtj.mongodb.net/places?retryWrites=true&w=majority";

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use("/api/users", usersRoutes);

app.use("/api/places", placesRoutes);

// Error hanlding for unsupported routes
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

// Error handling middleware after the routes
app.use((error, req, res, next) => {
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
