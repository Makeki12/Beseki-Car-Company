const express = require('express');
const router = express.Router();
const Car = require('../models/car');
const Notification = require('../models/Notification');

// Dummy middleware for admin check
function isAdmin(req, res, next) {
  // Replace with real auth check
  if (req.headers['x-admin'] === 'true') next();
  else res.status(403).json({ error: 'Admin only' });
}

// Add a car
router.post('/cars', isAdmin, async (req, res) => {
  const car = new Car(req.body);
  await car.save();
  res.status(201).json({ message: 'Car added!' });
});

// Update a car
router.put('/cars/:id', isAdmin, async (req, res) => {
  const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(car);
});

// Add a notification
router.post('/notifications', isAdmin, async (req, res) => {
  const notification = new Notification({ message: req.body.message });
  await notification.save();
  res.status(201).json({ message: 'Notification sent!' });
});

module.exports = router;