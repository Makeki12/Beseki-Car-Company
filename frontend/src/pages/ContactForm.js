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
        message: "❌ Date cannot be in the past.",
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
          preferredDate: new Date(formData.preferredDate).toISOString(), // FIXED DATE
          carId: selectedCarId,
        }
      );

      // Success
      setShowSuccessModal(true);

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
      setStatus({
        message: "❌ Failed to save booking. Try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => setShowSuccessModal(false);

  return (
    <div className="max-w-lg mx-auto bg-white shadow-xl p-6 rounded-2xl border border-gray-200 mt-10 mb-12 relative">

      {showSuccessModal && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}

      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
        Book a Test Drive
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number (10 digits)"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="date"
          name="preferredDate"
          value={formData.preferredDate}
          onChange={handleChange}
          className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-400"
          required
        />

        <select
          value={selectedCarId}
          onChange={handleCarSelect}
          className="w-full p-4 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-400"
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
          <div className="mt-3 p-2 bg-gray-100 rounded-xl shadow-md flex justify-center">
            <img
              src={selectedCarImage}
              alt="Car Preview"
              className="w-40 h-28 object-cover rounded-lg shadow"
            />
          </div>
        )}

        <textarea
          name="message"
          placeholder="Message (optional)"
          value={formData.message}
          onChange={handleChange}
          rows="4"
          className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-700 text-white py-4 rounded-lg font-semibold hover:bg-blue-800 transition ${
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

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 text-center shadow-xl">
            <h3 className="text-2xl font-bold text-green-600 mb-4">
              Booking Confirmed!
            </h3>
            <p className="mb-6">
              Thank you for booking a test drive. We will contact you shortly.
            </p>
            <button
              onClick={closeModal}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
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
