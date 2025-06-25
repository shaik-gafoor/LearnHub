const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const DBConnection = require("./config/connect");

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to MongoDB
DBConnection();

// Middleware
app.use(cors());
app.use(express.json()); // Parses JSON bodies

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Serve uploaded video files statically
app.use("/uploads", express.static(uploadsDir));

// Routes
app.use("/api/admin", require("./routers/adminRoutes"));
app.use("/api/user", require("./routers/userRoutes"));

// Default route (optional)
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
