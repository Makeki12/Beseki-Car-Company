require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// -------------------- MIDDLEWARE --------------------
app.use(cors());
app.use(express.json());

// Serve uploaded images publicly (for local uploads if any)
app.use("/uploads", express.static("uploads"));

// -------------------- DATABASE CONNECTION --------------------
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// -------------------- IMPORT ROUTES --------------------
const carsRouter = require("./routes/cars");
const bookingsRouter = require("./routes/bookings");
const notificationsRouter = require("./routes/notifications");
const adminRouter = require("./routes/admin");
const authRouter = require("./routes/authRoutes"); // ✅ Authentication routes

// -------------------- USE ROUTES --------------------
app.use("/api/cars", carsRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/auth", authRouter);

// -------------------- DEPLOYMENT SETUP --------------------
// When deploying, serve the frontend build automatically
if (process.env.NODE_ENV === "production") {
  // Serve static frontend files
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  // Handle all routes through React app
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"));
  });
}

// -------------------- DEFAULT ROUTE --------------------
app.get("/", (req, res) => {
  res.send("🚗 Beseki Car Showroom Backend is running...");
});

// -------------------- START SERVER --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});
