import React, { useState, useEffect } from "react";
import axios from "axios";

const ContactForm = () => {
  const [cars, setCars] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    message: "",
    carId: "",
  });

  const [status, setStatus] = useState("");

  // Fetch cars from backend
  useEffect(() => {
    axios
      .get("https://beseki-car-company.onrender.com/api/cars")
      .then((res) => {
        setCars(res.data);

        // ❗ Ensure carId is EMPTY so user MUST select
        setFormData((prev) => ({ ...prev, carId: "" }));
      })
      .catch((err) => console.error("Failed to load cars", err));
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit booking
  const handleSubmit = async (e) => {
    e.preventDefault();

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
    } catch (error) {
      console.log("Booking error:", error.response?.data);
      setStatus("❌ Failed to submit booking");
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        padding: "25px",
        background: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0px 4px 14px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "20px",
          color: "#0d47a1",
          fontSize: "28px",
          fontWeight: "bold",
        }}
      >
        Book a Test Drive
      </h2>

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

        {/* CAR SELECTION */}
        <label style={labelStyle}>Select a Car</label>
        <select
          name="carId"
          style={inputStyle}
          value={formData.carId}
          onChange={handleChange}
          required
        >
          <option value="">-- Select a car --</option>

          {cars.map((car) => (
            <option key={car._id} value={car._id}>
              {car.name} — KES {car.price.toLocaleString()}
            </option>
          ))}
        </select>

        {/* MESSAGE */}
        <label style={labelStyle}>Additional Message (Optional)</label>
        <textarea
          name="message"
          style={{ ...inputStyle, height: "100px" }}
          value={formData.message}
          onChange={handleChange}
        ></textarea>

        {/* BUTTON */}
        <button
          type="submit"
          style={{
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
          }}
        >
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


export default ContactForm;
