import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function BookTestDrive() {
  const location = useLocation();
  const preselectedCarId = location.state?.carId || "";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    carId: preselectedCarId, // preselect car if user clicked from CarDetails
    preferredDate: "",
    message: "",
  });

  const [cars, setCars] = useState([]);
  const [status, setStatus] = useState(null);

  const API_BASE =
    (typeof import.meta !== "undefined" &&
      import.meta.env &&
      import.meta.env.VITE_API_URL) ||
    process.env.REACT_APP_API_URL ||
    "https://beseki-backend.onrender.com";

  useEffect(() => {
    fetch(`${API_BASE}/api/cars`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load cars");
        return res.json();
      })
      .then((data) => setCars(data))
      .catch((err) => {
        console.error("Error fetching cars:", err);
        setStatus("⚠️ Unable to load cars. Please try again later.");
      });
  }, [API_BASE]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);

    try {
      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("✅ Booking saved successfully!");
        setForm({
          name: "",
          email: "",
          phone: "",
          carId: preselectedCarId, // keep the preselected car
          preferredDate: "",
          message: "",
        });
      } else {
        const err = await res.json();
        setStatus("❌ Error: " + (err.error || "Booking failed."));
      }
    } catch (err) {
      console.error("Booking error:", err);
      setStatus("⚠️ Server error. Please try again later.");
    }
  }

  return (
    <div
      style={{
        maxWidth: "550px",
        margin: "50px auto",
        padding: "30px",
        border: "1px solid #ddd",
        borderRadius: "12px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
        background: "#fff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#0d47a1",
          marginBottom: "25px",
        }}
      >
        🚗 Book a Test Drive
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          required
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        />

        <select
          name="carId"
          value={form.carId}
          onChange={handleChange}
          required
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "14px",
            backgroundColor: "#f9f9f9",
            color: "#333",
          }}
        >
          <option value="" disabled>
            -- Select Car Model --
          </option>
          {cars.map((car) => (
            <option
              key={car._id}
              value={car._id}
              style={{
                fontWeight: car._id === preselectedCarId ? "bold" : "normal",
                backgroundColor: car._id === preselectedCarId ? "#e3f2fd" : "",
              }}
            >
              {car.name} — Ksh {Number(car.price).toLocaleString()}
            </option>
          ))}
        </select>

        <input
          name="preferredDate"
          type="date"
          value={form.preferredDate}
          onChange={handleChange}
          required
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        />

        <textarea
          name="message"
          placeholder="Additional Message"
          value={form.message}
          onChange={handleChange}
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            minHeight: "100px",
            fontSize: "14px",
          }}
        />

        <button
          type="submit"
          style={{
            padding: "12px",
            background: "#0d47a1",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            transition: "0.3s",
          }}
          onMouseOver={(e) => (e.target.style.background = "#0941a3")}
          onMouseOut={(e) => (e.target.style.background = "#0d47a1")}
        >
          Book Test Drive
        </button>
      </form>

      {status && (
        <p
          style={{
            marginTop: "20px",
            textAlign: "center",
            color: status.startsWith("✅") ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {status}
        </p>
      )}
    </div>
  );
}
