const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const Car = require("../models/car");

// 📌 POST: Book a test drive
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, preferredDate, message, carId } = req.body;

    // ✅ Validate required fields
    if (!name || !email || !phone || !preferredDate || !carId) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided" });
    }

    // ✅ Check if car exists in the showroom
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ error: "Car not found in showroom" });
    }

    // ✅ Create booking
    const booking = new Booking({
      name,
      email,
      phone,
      preferredDate,
      message,
      car: car._id, // reference to Car
    });

    await booking.save();

    res.status(201).json({
      message: "Booking saved successfully!",
      booking,
    });
  } catch (err) {
    console.error("❌ Error saving booking:", err);
    res.status(500).json({ error: "Failed to save booking" });
  }
});

// 📌 GET: Get all bookings (Admin view)
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("car", "name price description images")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.error("❌ Error fetching bookings:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// 📌 DELETE: Remove a booking by ID (Admin use)
router.delete("/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json({ message: "✅ Booking deleted successfully!" });
  } catch (err) {
    console.error("❌ Error deleting booking:", err);
    res.status(500).json({ error: "Server error while deleting booking" });
  }
});

module.exports = router;
