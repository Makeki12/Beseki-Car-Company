require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

console.log("🔍 Starting server with route isolation...");

const app = express();

// -------------------- BASIC MIDDLEWARE --------------------
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

// -------------------- DEFAULT ROUTE --------------------
app.get("/", (req, res) => {
  res.send("🚗 Beseki Car Showroom Backend is running...");
});

console.log("✅ Basic setup complete");

// -------------------- ISOLATE ROUTES ONE BY ONE --------------------

// Test 1: Just the basic app without any routes
console.log("🧪 TEST 1: Basic app without custom routes...");
// Don't load any routes yet - if this works, the issue is in routes

// Test 2: Try each route file individually
try {
  console.log("\n🧪 TEST 2: Loading CARS routes...");
  const carsRouter = require("./routes/cars");
  app.use("/api/cars", carsRouter);
  console.log("✅ Cars routes loaded successfully");
} catch (error) {
  console.error("💥 CARS ROUTES FAILED:", error.message);
  process.exit(1);
}

try {
  console.log("🧪 TEST 3: Loading BOOKINGS routes...");
  const bookingsRouter = require("./routes/bookings");
  app.use("/api/bookings", bookingsRouter);
  console.log("✅ Bookings routes loaded successfully");
} catch (error) {
  console.error("💥 BOOKINGS ROUTES FAILED:", error.message);
  process.exit(1);
}

try {
  console.log("🧪 TEST 4: Loading NOTIFICATIONS routes...");
  const notificationsRouter = require("./routes/notifications");
  app.use("/api/notifications", notificationsRouter);
  console.log("✅ Notifications routes loaded successfully");
} catch (error) {
  console.error("💥 NOTIFICATIONS ROUTES FAILED:", error.message);
  process.exit(1);
}

try {
  console.log("🧪 TEST 5: Loading ADMIN routes...");
  const adminRouter = require("./routes/admin");
  app.use("/api/admin", adminRouter);
  console.log("✅ Admin routes loaded successfully");
} catch (error) {
  console.error("💥 ADMIN ROUTES FAILED:", error.message);
  process.exit(1);
}

try {
  console.log("🧪 TEST 6: Loading AUTH routes...");
  const authRouter = require("./routes/authRoutes");
  app.use("/api/auth", authRouter);
  console.log("✅ Auth routes loaded successfully");
} catch (error) {
  console.error("💥 AUTH ROUTES FAILED:", error.message);
  process.exit(1);
}

console.log("🎉 All routes loaded successfully!");

// -------------------- DEPLOYMENT SETUP --------------------
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"));
  });
}

// -------------------- START SERVER --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});