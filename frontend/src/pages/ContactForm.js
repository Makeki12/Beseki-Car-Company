import React, { useState, useEffect } from "react";
import axios from "axios";

const ContactForm = () => {
  const [cars, setCars] = useState([]);
  const [selectedCarId, setSelectedCarId] = useState(""); // selected car
  const [selectedCarImage, setSelectedCarImage] = useState(""); // preview image

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  // Fetch cars from backend
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await axios.get(
          "https://beseki-car-company.onrender.com/api/cars"
        );
        setCars(res.data);
      } catch (err) {
        console.error("Error fetching cars:", err);
      }
    };

    fetchCars();
  }, []);

  // Handle text input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle car selection
  const handleCarSelect = (e) => {
    const carId = e.target.value;
    setSelectedCarId(carId);

    const selectedCar = cars.find((car) => car.id === carId);
    if (selectedCar && selectedCar.images.length > 0) {
      setSelectedCarImage(selectedCar.images[0].url);
    } else {
      setSelectedCarImage("");
    }
  };

  // Submit booking
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    if (!selectedCarId) {
      setStatus("❌ Please select a car for your test drive.");
      return;
    }

    try {
      const res = await axios.post(
        "https://beseki-car-company.onrender.com/api/bookings",
        {
          ...formData,
          carId: selectedCarId, // VERY IMPORTANT
        }
      );

      setStatus("✅ Booking submitted successfully!");

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        preferredDate: "",
        message: "",
      });
      setSelectedCarId("");
      setSelectedCarImage("");
    } catch (err) {
      console.error("Booking error:", err.response?.data || err);
      setStatus("❌ Failed to save booking. Try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg p-6 rounded-xl border border-gray-200 mt-6 mb-10">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
        Book a Test Drive
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* FULL NAME */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 border rounded-md"
          required
        />

        {/* EMAIL */}
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border rounded-md"
          required
        />

        {/* PHONE */}
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-3 border rounded-md"
          required
        />

        {/* PREFERRED DATE */}
        <input
          type="date"
          name="preferredDate"
          value={formData.preferredDate}
          onChange={handleChange}
          className="w-full p-3 border rounded-md"
          required
        />

        {/* CAR SELECTION */}
        <select
          value={selectedCarId}
          onChange={handleCarSelect}
          className="w-full p-3 border rounded-md bg-gray-50"
          required
        >
          <option value="">Select a Car</option>
          {cars.map((car) => (
            <option key={car.id} value={car.id}>
              {car.name} — Ksh {car.price.toLocaleString()}
            </option>
          ))}
        </select>

        {/* CAR IMAGE PREVIEW */}
        {selectedCarImage && (
          <div className="mt-3">
            <img
              src={selectedCarImage}
              alt="Car Preview"
              className="w-full h-48 object-cover rounded-md border shadow"
            />
          </div>
        )}

        {/* MESSAGE */}
        <textarea
          name="message"
          placeholder="Message (optional)"
          value={formData.message}
          onChange={handleChange}
          rows="3"
          className="w-full p-3 border rounded-md"
        />

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-3 rounded-md font-semibold hover:bg-blue-800 transition"
        >
          Submit Booking
        </button>
      </form>

      {/* Status Message */}
      {status && (
        <p className="mt-4 text-center font-semibold text-red-600">{status}</p>
      )}
    </div>
  );
};

export default ContactForm;
