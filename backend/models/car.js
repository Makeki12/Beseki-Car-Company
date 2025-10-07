const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Car name is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Car price is required"],
      min: [0, "Price cannot be negative"],
    },
    description: {
      type: String,
      required: [true, "Car description is required"],
      trim: true,
    },
    images: {
      type: [String], // ✅ multiple image paths
      validate: {
        validator: function (arr) {
          return arr.length > 0; // ensure at least one image
        },
        message: "At least one image is required",
      },
    },
  },
  { timestamps: true }
);

// Optional: create an index for faster search on name and price
carSchema.index({ name: 1, price: 1 });

module.exports = mongoose.model("Car", carSchema);
