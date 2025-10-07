const express = require("express");
const Car = require("../models/Car");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const fs = require("fs");

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

// 📂 Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // save in uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // unique filename
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG/PNG images are allowed"));
    }
  },
});

// 📌 Public route: Get all cars
router.get("/", async (req, res) => {
  try {
    const cars = await Car.find();
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

// 📌 Admin-only: Add car (multiple images)
router.post("/", authMiddleware, upload.array("images", 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "At least one image is required" });
    }

    const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

    const car = new Car({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      images: imagePaths, // ✅ store multiple paths
    });

    await car.save();
    res.json({ success: true, car });
  } catch (err) {
    console.error("Error adding car:", err);
    res.status(500).json({ error: err.message });
  }
});

// 📌 Admin-only: Update car (details + add/remove images)
router.put("/:id", authMiddleware, upload.array("images", 5), async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ error: "Car not found" });

    // ✅ Update text fields
    if (req.body.name) car.name = req.body.name;
    if (req.body.price) car.price = req.body.price;
    if (req.body.description) car.description = req.body.description;

    // ✅ Handle new uploaded images
    if (req.files && req.files.length > 0) {
      const newImagePaths = req.files.map((file) => `/uploads/${file.filename}`);
      car.images.push(...newImagePaths);
    }

    // ✅ Handle image deletion (expects array of image URLs in req.body.removeImages)
    if (req.body.removeImages) {
      let removeList = [];
      try {
        removeList = JSON.parse(req.body.removeImages); // stringified array from frontend
      } catch {
        removeList = Array.isArray(req.body.removeImages) ? req.body.removeImages : [];
      }

      if (removeList.length > 0) {
        car.images = car.images.filter((img) => !removeList.includes(img));

        // Optionally delete the files physically
        removeList.forEach((imgPath) => {
          const fullPath = path.join(__dirname, "..", imgPath);
          if (fs.existsSync(fullPath)) {
            fs.unlink(fullPath, (err) => {
              if (err) console.error("Failed to delete file:", err);
            });
          }
        });
      }
    }

    await car.save();
    res.json({ success: true, car });
  } catch (err) {
    console.error("Error updating car:", err);
    res.status(500).json({ error: err.message });
  }
});

// 📌 Admin-only: Delete car (and its images)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ error: "Car not found" });

    // Delete images from filesystem
    car.images.forEach((imgPath) => {
      const fullPath = path.join(__dirname, "..", imgPath);
      if (fs.existsSync(fullPath)) {
        fs.unlink(fullPath, (err) => {
          if (err) console.error("Failed to delete file:", err);
        });
      }
    });

    await Car.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Car deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
