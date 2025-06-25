const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config(); // Make sure environment variables are loaded

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB, {
      dbName: "video-course-application",
    });

    console.log(" MongoDB connected successfully");
  } catch (error) {
    console.error(" MongoDB connection failed:", error.message);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;
