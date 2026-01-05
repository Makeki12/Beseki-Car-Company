import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const ContactForm = () => {
  const [cars, setCars] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

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

  /* ---------------- FETCH CARS ---------------- */
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

  /* -------- CLOSE DROPDOWN ON OUTSIDE CLICK -------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const selectCar = (car) => {
    setSelectedCar(car);
    setShowDropdown(false);
  };

  /* ---------------- VALIDATION ---------------- */
  const validateForm = () => {
    const { name, email, phone, preferredDate } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const today = new Date().toISOString().split("T")[0];

    if (!name || !email || !phone || !preferredDate || !selectedCar) {
      setStatus({ message: "❌ Please fill in all required fields.", type: "error" });
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

  /* ---------------- SUBMIT ---------------- */
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
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-200 p-8">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">
          Book a Test Drive
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* INPUTS */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number (10 digits)"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
          />

          <input
            type="date"
            name="preferredDate"
            min={new Date().toISOString().split("T")[0]}
            value={formData.preferredDate}
            onChange={handleChange}
            className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
          />

          {/* -------- CAR DROPDOWN (SMALL PREVIEW ONLY) -------- */}
          <div ref={dropdownRef} className="relative">
            <div
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-4 p-4 border rounded-xl bg-gray-100 cursor-pointer hover:border-blue-500 transition"
            >
              {selectedCar ? (
                <>
                  <img
                    src={selectedCar.images[0]?.url}
                    alt="car"
                    className="w-14 h-14 object-cover rounded-lg"
                  />
                  <div>
                    <p className="font-semibold">{selectedCar.name}</p>
                    <p className="text-sm text-blue-600 font-bold">
                      Ksh {selectedCar.price.toLocaleString()}
                    </p>
                  </div>
                </>
              ) : (
                <span className="text-gray-500">Select a Car</span>
              )}
            </div>

            {showDropdown && (
              <div className="absolute z-30 mt-2 w-full bg-white border rounded-xl shadow-lg max-h-64 overflow-y-auto">
                {cars.map((car) => (
                  <div
                    key={car.id}
                    onClick={() => selectCar(car)}
                    className="flex items-center gap-4 p-4 hover:bg-blue-50 cursor-pointer transition"
                  >
                    <img
                      src={car.images[0]?.url}
                      alt={car.name}
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

          <textarea
            name="message"
            placeholder="Message (optional)"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-700 text-white py-4 rounded-xl font-semibold transition ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-800"
            }`}
          >
            {loading ? "Submitting..." : "Submit Booking"}
          </button>
        </form>

        {status.message && (
          <p
            className={`mt-6 text-center font-semibold ${
              status.type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {status.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ContactForm;
