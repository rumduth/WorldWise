// server/models/userModel.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "An account must have a name"],
    trim: true,
  },
  password: {
    type: String,
    required: [true, "An account must have a password"],
    minlength: [6, "Password must be at least 6 characters"],
  },
  locations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
    },
  ],
  email: {
    type: String,
    required: [true, "An account must have an email"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  avatar: {
    type: String,
    default: "https://i.pravatar.cc/100?u=zz",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
