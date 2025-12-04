import React, { useState, useEffect } from "react";
import axios from "axios";

const ContactForm = () => {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    message: "",
    carId: "",
  });

  const [status, setStatus] = useState("");

  // Load cars
  useEffect(() => {
    axios
      .get("https://beseki-car-company.onrender.com/api/cars")
      .then((res) => {
        setCars(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // If user selects a car, update preview
    if (name === "carId") {
      const car = cars.find((c) => c._id === value);
      setSelectedCar(car || null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus("");

    if (!formData.carId) {
      setStatus("❌ Please select a car");
      return;
    }

    try {
      const response = await axios.post(
        "https://beseki-car-company.onrender.com/api/bookings",
        formData
      );

      setStatus("✅ Booking submitted successfully!");

      setFormData({
        name: "",
        email: "",
        phone: "",
        preferredDate: "",
        message: "",
        carId: "",
      });

      setSelectedCar(null);
    } catch (error) {
      console.error("Booking error:", error.response?.data);
      setStatus("❌ Failed to save booking – backend error");
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        padding: "25px",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={headerStyle}>Book a Test Drive</h2>

      <form onSubmit={handleSubmit}>
        {/* NAME */}
        <label style={labelStyle}>Full Name</label>
        <input
          type="text"
          name="name"
          style={inputStyle}
          value={formData.name}
          onChange={handleChange}
          required
        />

        {/* EMAIL */}
        <label style={labelStyle}>Email</label>
        <input
          type="email"
          name="email"
          style={inputStyle}
          value={formData.email}
          onChange={handleChange}
          required
        />

        {/* PHONE */}
        <label style={labelStyle}>Phone Number</label>
        <input
          type="text"
          name="phone"
          style={inputStyle}
          value={formData.phone}
          onChange={handleChange}
          required
        />

        {/* DATE */}
        <label style={labelStyle}>Preferred Date</label>
        <input
          type="date"
          name="preferredDate"
          style={inputStyle}
          value={formData.preferredDate}
          onChange={handleChange}
          required
        />

        {/* CAR DROPDOWN */}
        <label style={labelStyle}>Select a Car</label>
        <select
          name="carId"
          style={inputStyle}
          value={formData.carId}
          onChange={handleChange}
          required
        >
          <option value="">-- Choose a car --</option>

          {cars.map((car) => (
            <option key={car._id} value={car._id}>
              {car.name} — KES {car.price.toLocaleString()}
            </option>
          ))}
        </select>

        {/* CAR IMAGE PREVIEW */}
        {selectedCar && selectedCar.images && selectedCar.images.length > 0 && (
          <div
            style={{
              marginTop: "15px",
              textAlign: "center",
            }}
          >
            <p style={{ fontWeight: "600", color: "#0d47a1" }}>
              Selected Car Preview:
            </p>
            <img
              src={selectedCar.images[0]}
              alt="Car Preview"
              style={{
                width: "100%",
                maxHeight: "230px",
                objectFit: "cover",
                borderRadius: "10px",
                border: "1px solid #ccc",
              }}
            />
          </div>
        )}

        {/* MESSAGE */}
        <label style={labelStyle}>Message (optional)</label>
        <textarea
          name="message"
          style={{ ...inputStyle, height: "100px" }}
          value={formData.message}
          onChange={handleChange}
        ></textarea>

        {/* SUBMIT */}
        <button type="submit" style={buttonStyle}>
          Submit Booking
        </button>
      </form>

      {status && (
        <p
          style={{
            marginTop: "15px",
            textAlign: "center",
            fontWeight: "bold",
            color: status.includes("❌") ? "red" : "green",
          }}
        >
          {status}
        </p>
      )}
    </div>
  );
};

const headerStyle = {
  textAlign: "center",
  marginBottom: "20px",
  color: "#0d47a1",
  fontSize: "28px",
  fontWeight: "bold",
};

const labelStyle = {
  display: "block",
  marginTop: "12px",
  marginBottom: "5px",
  fontWeight: "600",
  color: "#0d47a1",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  marginBottom: "10px",
  fontSize: "15px",
};

const buttonStyle = {
  width: "100%",
  marginTop: "15px",
  padding: "12px",
  background: "#0d47a1",
  color: "white",
  fontSize: "16px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
  transition: "0.3s",
};


export default ContactForm;
