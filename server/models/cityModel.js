// server/models/cityModel.js
const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
  cityName: {
    type: String,
    required: [true, "A city must have a name"],
  },
  country: {
    type: String,
    required: [true, "A city must have a country"],
  },
  emoji: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
  },
  position: {
    lat: {
      type: Number,
      required: [true, "A city must have a latitude"],
    },
    lng: {
      type: Number,
      required: [true, "A city must have a longitude"],
    },
  },
});

const City = mongoose.model("City", citySchema);

module.exports = City;
