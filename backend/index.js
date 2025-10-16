require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// -------------------- MIDDLEWARE --------------------
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ✅ FIXED CORS CONFIG
const allowedOrigins = [
  "http://localhost:3000", // local dev
  "https://beseki-car-company.vercel.app", // your Vercel frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// -------------------- DATABASE CONNECTION --------------------
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// -------------------- ROUTES --------------------
const carsRouter = require("./routes/cars");
const bookingsRouter = require("./routes/bookings");
const notificationsRouter = require("./routes/notifications");
const adminRouter = require("./routes/admin");
const authRouter = require("./routes/authRoutes");

app.use("/api/cars", carsRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send("🚗 Beseki Car Showroom Backend is running...");
});

// -------------------- DEPLOYMENT --------------------
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/build");
  app.use(express.static(frontendPath));
  app.get(/.*/, (req, res) =>
    res.sendFile(path.resolve(frontendPath, "index.html"))
  );
}

// -------------------- START SERVER --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
  )
);
