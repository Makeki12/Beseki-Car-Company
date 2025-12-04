import React, { useState, useEffect } from "react";
import axios from "axios";
import Confetti from "react-confetti";

const ContactForm = () => {
  const [cars, setCars] = useState([]);
  const [selectedCarId, setSelectedCarId] = useState("");
  const [selectedCarImage, setSelectedCarImage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    message: "",
  });

  const [status, setStatus] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

  const validateForm = () => {
    const { name, email, phone, preferredDate } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const today = new Date().toISOString().split("T")[0];

    if (!name || !email || !phone || !preferredDate || !selectedCarId) {
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
      setStatus({ message: "❌ Date cannot be in the past.", type: "error" });
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
        { ...formData, carId: selectedCarId }
      );

      // Show success modal
      setShowSuccessModal(true);

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
      setStatus({ message: "❌ Failed to save booking. Try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => setShowSuccessModal(false);

  return (
    <div className="max-w-lg mx-auto bg-white shadow-xl p-6 rounded-2xl border border-gray-200 mt-10 mb-12 transition-transform transform hover:scale-[1.02] duration-300 relative">
      {/* Confetti */}
      {showSuccessModal && <Confetti width={window.innerWidth} height={window.innerHeight} />}

      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700 drop-shadow-sm">
        Book a Test Drive
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number (10 digits)"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition"
          required
        />
        <input
          type="date"
          name="preferredDate"
          value={formData.preferredDate}
          onChange={handleChange}
          className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition"
          required
        />

        <select
          value={selectedCarId}
          onChange={handleCarSelect}
          className="w-full p-4 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 outline-none transition"
          required
        >
          <option value="">Select a Car</option>
          {cars.map((car) => (
            <option key={car.id} value={car.id}>
              {car.name} — Ksh {car.price.toLocaleString()}
            </option>
          ))}
        </select>

        {selectedCarImage && (
          <div className="mt-3 overflow-hidden rounded-xl shadow-lg transition-transform transform hover:scale-105">
            <img
              src={selectedCarImage}
              alt="Car Preview"
              className="w-full h-52 object-cover"
            />
          </div>
        )}

        <textarea
          name="message"
          placeholder="Message (optional)"
          value={formData.message}
          onChange={handleChange}
          rows="4"
          className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-700 text-white py-4 rounded-lg font-semibold hover:bg-blue-800 transition-all duration-300 shadow-md hover:shadow-lg ${
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

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-sm text-center relative shadow-lg">
            <h3 className="text-2xl font-bold text-green-600 mb-4">
              Booking Confirmed!
            </h3>
            <p className="mb-6">Thank you for booking a test drive. We will contact you soon!</p>
            <button
              onClick={closeModal}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactForm;
