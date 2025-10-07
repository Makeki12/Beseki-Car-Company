require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded images publicly
app.use("/uploads", express.static("uploads"));


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB error:", err));

// Import routes
const carsRouter = require("./routes/cars");
const bookingsRouter = require("./routes/bookings");
const notificationsRouter = require("./routes/Notifications");
const adminRouter = require("./routes/admin");
const authRouter = require("./routes/authRoutes"); // ✅ NEW

// Use routes
app.use("/api/cars", carsRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/auth", authRouter); // ✅ NEW

// Default route
app.get("/", (req, res) => {
  res.send("🚗 Beseki Car Showroom Backend is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
