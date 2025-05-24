const express = require("express");
const cityController = require("../controllers/cityController");
const authController = require("../controllers/authController");

const router = express.Router();

// Apply auth middleware to all routes below
router.use(authController.auth);

// Cities list & creation
router
  .route("/")
  .get(cityController.getAllCities)
  .post(cityController.createCity);

// Individual city retrieval, update & deletion
router
  .route("/:id")
  .get(cityController.getCity)
  .patch(cityController.updateCity)
  .delete(cityController.deleteCity);

module.exports = router;