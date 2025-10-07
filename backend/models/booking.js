const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // customer name
    email: { type: String, required: true }, // customer email
    phone: { type: String, required: true }, // customer phone
    preferredDate: { type: String, required: true }, // date for test drive
    message: { type: String }, // optional message
    car: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Car", // ✅ reference to Car model
      required: true 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
