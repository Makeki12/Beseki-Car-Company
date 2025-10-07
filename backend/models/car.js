const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  public_id: {
    type: String,
    required: true,
  },
});

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
      type: [imageSchema], // ✅ Each image has { url, public_id }
      validate: {
        validator: function (arr) {
          return arr.length > 0; // Ensure at least one image exists
        },
        message: "At least one image is required",
      },
    },
  },
  { timestamps: true }
);

// ✅ Index for faster search
carSchema.index({ name: 1, price: 1 });

// ✅ Clean up how data is sent to frontend
carSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Car", carSchema);
