import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const ContactForm = () => {
  const [cars, setCars] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  const [selectedCar, setSelectedCar] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    message: "",
  });

  const [status, setStatus] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);

  // Fetch cars
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const selectCar = (car) => {
    setSelectedCar(car);
    setShowDropdown(false);
  };

  const validateForm = () => {
    const { name, email, phone, preferredDate } = formData;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    const today = new Date().toISOString().split("T")[0];

    if (!name || !email || !phone || !preferredDate || !selectedCar) {
      setStatus({
        message: "❌ Please fill in all required fields.",
        type: "error",
      });
      return false;
    }
    if (!emailRegex.test(email)) {
      setStatus({ message: "❌ Invalid email address.", type: "error" });
      return false;
    }
    if (!phoneRegex.test(phone)) {
      setStatus({ message: "❌ Phone must be 10 digits.", type: "error" });
      return false;
    }
    if (preferredDate < today) {
      setStatus({
        message: "❌ The test drive date cannot be in the past.",
        type: "error",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ message: "", type: "" });

    if (!validateForm()) return;

    setLoading(true);

    try {
      await axios.post(
        "https://beseki-car-company.onrender.com/api/bookings",
        {
          ...formData,
          carId: selectedCar.id,
        }
      );

      setStatus({
        message: "✅ Booking successful! We will contact you shortly.",
        type: "success",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        preferredDate: "",
        message: "",
      });
      setSelectedCar(null);
    } catch (err) {
      console.error("Booking error:", err.response?.data || err);
      setStatus({
        message: "❌ Failed to save booking. Try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 mb-16 p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
        Book a Test Drive
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-4 border rounded-xl shadow-sm"
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-4 border rounded-xl shadow-sm"
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number (10 digits)"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-4 border rounded-xl shadow-sm"
        />

        <input
          type="date"
          name="preferredDate"
          value={formData.preferredDate}
          onChange={handleChange}
          className="w-full p-4 border rounded-xl shadow-sm"
        />

        {/* ------- CAR DROPDOWN -------- */}
        <div ref={dropdownRef} className="relative">
          <div
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-4 border rounded-xl bg-gray-100 cursor-pointer flex items-center gap-3 shadow-sm"
          >
            {selectedCar ? (
              <>
                <img
                  src={selectedCar.images[0]?.url}
                  className="w-14 h-14 object-cover rounded-lg"
                  alt="thumb"
                />
                <span className="font-semibold">
                  {selectedCar.name} — Ksh {selectedCar.price.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-gray-500">Select a Car</span>
            )}
          </div>

          {showDropdown && (
            <div
              className="absolute left-0 right-0 mt-2 bg-white border rounded-xl shadow-lg max-h-72 overflow-y-auto z-20"
            >
              {cars.map((car) => (
                <div
                  key={car.id}
                  onClick={() => selectCar(car)}
                  className="flex items-center gap-4 p-3 hover:bg-blue-50 cursor-pointer transition"
                >
                  <img
                    src={car.images[0]?.url}
                    alt="car"
                    className="w-14 h-14 object-cover rounded-lg"
                  />
                  <div>
                    <p className="font-semibold">{car.name}</p>
                    <p className="text-sm text-gray-600">
                      Ksh {car.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ---- REMOVED BIG PREVIEW HERE ---- */}

        <textarea
          name="message"
          placeholder="Message (optional)"
          value={formData.message}
          onChange={handleChange}
          className="w-full p-4 border rounded-xl shadow-sm"
          rows="4"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-700 text-white py-4 rounded-xl font-semibold hover:bg-blue-800 transition ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Submitting..." : "Submit Booking"}
        </button>
      </form>

      {status.message && (
        <p
          className={`mt-5 text-center font-semibold ${
            status.type === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {status.message}
        </p>
      )}
    </div>
  );
};

export default ContactForm;
