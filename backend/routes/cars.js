const express = require("express");
const Car = require("../models/car");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const { cloudinary } = require("../utils/cloudinary");

const router = express.Router();

// 🔒 Middleware to check admin token
function authMiddleware(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1]; // Expect: "Bearer <token>"
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// 📦 Multer setup (store in memory since Cloudinary handles storage)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype) cb(null, true);
    else cb(new Error("Only JPEG/PNG images are allowed"));
  },
});

// 📌 Public route: Get all cars
router.get("/", async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cars" });
  }
});

// 📌 Public route: Get a single car by ID
router.get("/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json(car);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 📌 Admin-only: Add car (upload to Cloudinary)
router.post("/", authMiddleware, upload.array("images", 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ error: "At least one image is required" });

    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { folder: "beseki_cars" },
            (error, result) => {
              if (error) reject(error);
              else resolve({
                url: result.secure_url,
                public_id: result.public_id,
              });
            }
          )
          .end(file.buffer);
      });
    });

    const uploadedImages = await Promise.all(uploadPromises);

    const car = new Car({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      images: uploadedImages, // ✅ Store { url, public_id }
    });

    await car.save();
    res.json({ success: true, car });
  } catch (err) {
    console.error("Error adding car:", err);
    res.status(500).json({ error: err.message });
  }
});

// 📌 Admin-only: Update car
router.put("/:id", authMiddleware, upload.array("images", 5), async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ error: "Car not found" });

    // Update text fields
    car.name = req.body.name || car.name;
    car.price = req.body.price || car.price;
    car.description = req.body.description || car.description;

    // Handle new images
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { folder: "beseki_cars" },
              (error, result) => {
                if (error) reject(error);
                else resolve({
                  url: result.secure_url,
                  public_id: result.public_id,
                });
              }
            )
            .end(file.buffer);
        });
      });

      const uploadedImages = await Promise.all(uploadPromises);
      car.images.push(...uploadedImages);
    }

    // Handle image deletion (expects array of public_ids)
    if (req.body.removeImages) {
      let removeList = [];
      try {
        removeList = JSON.parse(req.body.removeImages);
      } catch {
        removeList = Array.isArray(req.body.removeImages) ? req.body.removeImages : [];
      }

      if (removeList.length > 0) {
        // Delete from Cloudinary
        for (const public_id of removeList) {
          await cloudinary.uploader.destroy(public_id);
        }

        // Remove from DB
        car.images = car.images.filter((img) => !removeList.includes(img.public_id));
      }
    }

    await car.save();
    res.json({ success: true, car });
  } catch (err) {
    console.error("Error updating car:", err);
    res.status(500).json({ error: err.message });
  }
});

// 📌 Admin-only: Delete car + Cloudinary images
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ error: "Car not found" });

    // Delete all images from Cloudinary
    for (const img of car.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    await Car.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Car and its images deleted" });
  } catch (err) {
    console.error("Error deleting car:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
