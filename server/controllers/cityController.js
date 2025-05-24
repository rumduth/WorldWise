const City = require("../models/cityModel");

// Get all cities for the authenticated user
exports.getAllCities = async (req, res) => {
  try {
    const userCities = req.user.locations;
    const cities = await City.find({ _id: { $in: userCities } });
    res.status(200).json(cities);
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

// Get a single city (must belong to the user)
exports.getCity = async (req, res) => {
  try {
    const cityId = req.params.id;
    if (!req.user.locations.includes(cityId)) {
      return res.status(403).json({
        status: "fail",
        message: "You do not have access to this city",
      });
    }

    const city = await City.findById(cityId);
    if (!city) {
      return res.status(404).json({
        status: "fail",
        message: "City not found",
      });
    }

    res.status(200).json(city);
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

// Create a new city and associate with the user
exports.createCity = async (req, res) => {
  try {
    const newCity = await City.create(req.body);

    // Add city to user's locations
    req.user.locations.push(newCity._id);
    await req.user.save();

    res.status(201).json(newCity);
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// Delete a city (only if it belongs to the user)
exports.deleteCity = async (req, res) => {
  try {
    const cityId = req.params.id;

    if (!req.user.locations.includes(cityId)) {
      return res.status(403).json({
        status: "fail",
        message: "You do not have permission to delete this city",
      });
    }

    const deletedCity = await City.findByIdAndDelete(cityId);
    if (!deletedCity) {
      return res.status(404).json({
        status: "fail",
        message: "City not found",
      });
    }

    // Remove city from user's locations
    req.user.locations = req.user.locations.filter(
      (id) => id.toString() !== cityId
    );
    await req.user.save();

    res.status(204).json({ status: "success", data: null });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.updateCity = async (req, res) => {
  console.log(req.body);
  try {
    const updatedCity = await City.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedCity) {
      return res.status(404).json({
        status: "fail",
        message: "No city found with that ID",
      });
    }

    res.status(200).json(updatedCity);
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};