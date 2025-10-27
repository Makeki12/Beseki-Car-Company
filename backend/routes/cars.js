const express = require("express");
const Car = require("../models/car");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const cloudinary = require("../utils/cloudinary"); // ✅ fixed import

const router = express.Router();

// 🔒 Middleware to check admin token
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]; // Expect "Bearer <token>"
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// 📦 Multer setup (store in memory for Cloudinary)
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
    res.status(500).json({ error: err.message });
  }
});

// 📌 Admin-only: Add car
router.post("/", authMiddleware, upload.array("images", 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "At least one image is required" });
    }

    const uploadPromises = req.files.map(
      (file) =>
        new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "beseki_cars" },
            (error, result) => {
              if (error) reject(error);
              else if (result)
                resolve({ url: result.secure_url, public_id: result.public_id });
              else reject(new Error("Cloudinary upload failed"));
            }
          );
          uploadStream.end(file.buffer);
        })
    );

    const uploadedImages = await Promise.all(uploadPromises);

    const car = new Car({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      images: uploadedImages,
    });

    await car.save();
    res.status(201).json({ success: true, car });
  } catch (err) {
    console.error("❌ Error adding car:", err);
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

    // Upload new images
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: "beseki_cars" },
              (error, result) => {
                if (error) reject(error);
                else if (result)
                  resolve({ url: result.secure_url, public_id: result.public_id });
              }
            );
            uploadStream.end(file.buffer);
          })
      );

      const uploadedImages = await Promise.all(uploadPromises);
      car.images.push(...uploadedImages);
    }

    // Remove selected images
    if (req.body.removeImages) {
      let removeList = [];
      try {
        removeList = JSON.parse(req.body.removeImages);
      } catch {
        if (Array.isArray(req.body.removeImages))
          removeList = req.body.removeImages;
      }

      if (removeList.length > 0) {
        await Promise.all(removeList.map((id) => cloudinary.uploader.destroy(id)));
        car.images = car.images.filter((img) => !removeList.includes(img.public_id));
      }
    }

    await car.save();
    res.json({ success: true, car });
  } catch (err) {
    console.error("❌ Error updating car:", err);
    res.status(500).json({ error: err.message });
  }
});

// 📌 Admin-only: Delete car
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ error: "Car not found" });

    // Delete all Cloudinary images
    await Promise.all(
      car.images.map((img) => cloudinary.uploader.destroy(img.public_id))
    );

    await car.deleteOne();
    res.json({ success: true, message: "Car and its images deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting car:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
