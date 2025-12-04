import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ContactForm() {
  const API = "https://beseki-car-company.onrender.com";

  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [status, setStatus] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    message: "",
    carId: "",
  });

  // Load cars
  useEffect(() => {
    axios
      .get(`${API}/api/cars`)
      .then((res) => {
        setCars(res.data);
      })
      .catch((err) => {
        console.error("Error loading cars:", err);
      });
  }, []);

  // Update Form Values
  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    // Update car preview
    if (name === "carId") {
      const car = cars.find((c) => c._id === value);
      setSelectedCar(car || null);
    }
  }

  // Submit Booking
  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("");

    if (!form.carId) {
      setStatus("❌ Please select a car.");
      return;
    }

    try {
      const res = await axios.post(`${API}/api/bookings`, form);

      if (res.status === 201) {
        setStatus("✅ Booking saved successfully!");

        setForm({
          name: "",
          email: "",
          phone: "",
          preferredDate: "",
          message: "",
          carId: "",
        });

        setSelectedCar(null);
      }
    } catch (err) {
      console.error("Booking error:", err.response?.data);
      setStatus("❌ " + (err.response?.data?.error || "Failed to save booking"));
    }
  }

  return (
    <div
      style={{
        maxWidth: "650px",
        margin: "40px auto",
        padding: "30px",
        background: "#fff",
        borderRadius: "15px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#0d47a1",
          fontSize: "28px",
          marginBottom: "20px",
          fontWeight: "bold",
        }}
      >
        🚗 Book a Test Drive
      </h2>

      <form onSubmit={handleSubmit}>
        {/* NAME */}
        <label style={labelStyle}>Full Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        {/* EMAIL */}
        <label style={labelStyle}>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        {/* PHONE */}
        <label style={labelStyle}>Phone Number</label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        {/* DATE */}
        <label style={labelStyle}>Preferred Date</label>
        <input
          type="date"
          name="preferredDate"
          value={form.preferredDate}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        {/* CAR SELECT */}
        <label style={labelStyle}>Select a Car</label>
        <select
          name="carId"
          value={form.carId}
          onChange={handleChange}
          required
          style={inputStyle}
        >
          <option value="">-- Choose a car model --</option>
          {cars.map((car) => (
            <option key={car._id} value={car._id}>
              {car.name} — Ksh {Number(car.price).toLocaleString()}
            </option>
          ))}
        </select>

        {/* IMAGE PREVIEW */}
        {selectedCar && (
          <div style={{ marginTop: "15px", textAlign: "center" }}>
            <p style={{ fontWeight: "bold", color: "#0d47a1" }}>
              Selected Car Preview:
            </p>
            <img
              src={selectedCar.images?.[0]?.url}
              alt="Car"
              style={{
                width: "100%",
                maxHeight: "260px",
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
          value={form.message}
          onChange={handleChange}
          style={{ ...inputStyle, minHeight: "100px" }}
        ></textarea>

        {/* SUBMIT */}
        <button type="submit" style={buttonStyle}>
          Submit Booking
        </button>
      </form>

      {status && (
        <p
          style={{
            marginTop: "20px",
            textAlign: "center",
            fontWeight: "bold",
            color: status.startsWith("❌") ? "red" : "green",
          }}
        >
          {status}
        </p>
      )}
    </div>
  );
}

// Styles
const inputStyle = {
  width: "100%",
  padding: "12px",
  border: "1px solid #ccc",
  borderRadius: "10px",
  fontSize: "16px",
  marginBottom: "10px",
};

const labelStyle = {
  fontWeight: "bold",
  marginBottom: "5px",
  display: "block",
  color: "#0d47a1",
};

const buttonStyle = {
  width: "100%",
  padding: "14px",
  marginTop: "15px",
  background: "#0d47a1",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontSize: "17px",
  cursor: "pointer",
  fontWeight: "bold",
};
