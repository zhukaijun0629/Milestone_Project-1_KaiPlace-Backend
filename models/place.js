const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const placeSchema = new Schema({
  description: { type: String, required: true },
  image: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  createdAt: { type: Date, required: true, default: Date.now },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  dateTakenAt: { type: Date, required: true, default: Date.now },
});

module.exports = mongoose.model("Place", placeSchema);
