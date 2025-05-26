const User = require("../models/userModel");
const bcrypt = require("bcrypt");

exports.updateProfile = async (req, res) => {
  try {
    const { username, avatar } = req.body;

    if (!username) {
      return res.status(400).json({
        message: "Username is required",
      });
    }

    const user = await User.findById(req.user._id);

    user.username = username;
    if (avatar !== undefined) {
      user.avatar = avatar;
    }

    await user.save();

    const userToReturn = {
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      likedCountries: user.likedCountries,
    };

    res.status(200).json({
      message: "Profile updated successfully",
      user: userToReturn,
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    const user = await User.findById(req.user._id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error("Update password error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.toggleLikeCountry = async (req, res) => {
  try {
    const { country } = req.body;
    if (!country) {
      return res.status(400).json({ message: "Country is required" });
    }
    const user = await User.findById(req.user._id);
    const index = user.likedCountries.indexOf(country);
    if (index === -1) {
      user.likedCountries.push(country);
    } else {
      user.likedCountries.splice(index, 1);
    }
    await user.save();
    res.status(200).json({
      message: "Liked countries updated",
      likedCountries: user.likedCountries,
    });
  } catch (err) {
    console.error("Toggle like country error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
