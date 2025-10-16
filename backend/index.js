require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// -------------------- MIDDLEWARE --------------------
app.use(cors());
app.use(express.json());
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
const authRouter = require("./routes/authRoutes");

// -------------------- USE ROUTES --------------------
app.use("/api/cars", carsRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/auth", authRouter);

// -------------------- DEFAULT ROUTE --------------------
app.get("/", (req, res) => {
  res.send("🚗 Beseki Car Showroom Backend is running...");
});

// -------------------- DEPLOYMENT SETUP --------------------
if (process.env.NODE_ENV === "production") {
  // Serve frontend build files
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  // FIXED: Express 5+ no longer supports '*' wildcard directly
  app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"));
  });
}

// -------------------- START SERVER --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
  );
});
