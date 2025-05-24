const mongoose = require("mongoose");
const dotenv = require("dotenv");
const City = require("./models/cityModel");
const User = require("./models/userModel");
dotenv.config();

const cities = [
  {
    cityName: "Lisbon",
    country: "Portugal",
    emoji: "🇵🇹",
    date: new Date("2027-10-31T15:59:59.138Z"),
    notes: "My favorite city so far!",
    position: {
      lat: 38.727881642324164,
      lng: -9.140900099907554,
    },
  },
  {
    cityName: "Madrid",
    country: "Spain",
    emoji: "🇪🇸",
    date: new Date("2027-07-15T08:22:53.976Z"),
    notes: "",
    position: {
      lat: 40.46635901755316,
      lng: -3.7133789062500004,
    },
  },
  // Add more cities as needed
];

// Connect to database
mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    // Delete all existing cities
    await City.deleteMany();
    console.log("Cities deleted");

    // Insert new cities
    const citiesList = await City.insertMany(cities);
    console.log("Cities inserted");

    const citiesReferences = citiesList.map((city) => city._id);
    await User.insertOne({
      username: "testuser",
      password: "123456",
      email: "test@gmail.com",
      locations: citiesReferences,
    });
    console.log("User inserted");

    // Disconnect from database
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error(err);
    mongoose.connection.close();
  });
