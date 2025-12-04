import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function BookTestDrive() {
  const location = useLocation();
  const preselectedCarId = location.state?.carId || "";

  // CORRECT FIELD NAMES TO MATCH BACKEND
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    carId: preselectedCarId,
    preferredDate: "",
    message: "",
  });

  const [cars, setCars] = useState([]);
  const [status, setStatus] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const API_BASE =
    (typeof import.meta !== "undefined" &&
      import.meta.env &&
      import.meta.env.VITE_API_URL) ||
    process.env.REACT_APP_API_URL ||
    "https://beseki-backend.onrender.com";

  // Load car list
  useEffect(() => {
    fetch(`${API_BASE}/api/cars`)
      .then((res) => res.json())
      .then((data) => setCars(data))
      .catch(() => setStatus("⚠️ Unable to load cars"));
  }, [API_BASE]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle input change
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Select car from dropdown
  function selectCar(carId) {
    setForm({ ...form, carId });
    setDropdownOpen(false);
  }

  // Submit form to backend
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
        setStatus("✅ Test Drive Booking Submitted!");

        setForm({
          name: "",
          email: "",
          phone: "",
          carId: "",
          preferredDate: "",
          message: "",
        });
      } else {
        const err = await res.json();
        setStatus("❌ " + (err.error || "Invalid form data"));
      }
    } catch (err) {
      console.error("Booking error:", err);
      setStatus("⚠️ Server error. Try again later.");
    }
  }

  const selectedCar = cars.find((c) => c._id === form.carId);

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        padding: "30px",
        borderRadius: "14px",
        background: "#fff",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#0d47a1",
          fontSize: "28px",
          marginBottom: "20px",
        }}
      >
        🚗 Book a Test Drive
      </h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <input
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        {/* CAR DROPDOWN (FIXED) */}
        <div ref={dropdownRef} style={{ position: "relative" }}>
          <div onClick={() => setDropdownOpen(!dropdownOpen)} style={dropdownButton}>
            {selectedCar ? (
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img
                  src={selectedCar.images?.[0]?.url}
                  alt={selectedCar.name}
                  style={carThumb}
                />
                <span>
                  {selectedCar.name} — Ksh {Number(selectedCar.price).toLocaleString()}
                </span>
              </div>
            ) : (
              <span style={{ color: "#999" }}>-- Select Car Model --</span>
            )}

            <span style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "0.3s" }}>
              ▼
            </span>
          </div>

          {dropdownOpen && (
            <div style={dropdownList}>
              {cars.map((car) => (
                <div
                  key={car._id}
                  onClick={() => selectCar(car._id)}
                  style={{
                    ...dropdownItem,
                    background: car._id === form.carId ? "#e3f2fd" : "#fff",
                  }}
                >
                  <img src={car.images?.[0]?.url} alt={car.name} style={carThumb} />
                  <span>{car.name} — Ksh {Number(car.price).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <input
          name="preferredDate"
          type="date"
          value={form.preferredDate}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <textarea
          name="message"
          placeholder="Message (optional)"
          value={form.message}
          onChange={handleChange}
          style={{ ...inputStyle, minHeight: "100px" }}
        />

        <button type="submit" style={submitButton}>
          Book Test Drive
        </button>
      </form>

      {status && (
        <p style={{ marginTop: "20px", textAlign: "center", fontWeight: "bold", color: status.startsWith("✅") ? "green" : "red" }}>
          {status}
        </p>
      )}
    </div>
  );
}

// ---------- STYLES ----------
const inputStyle = {
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  fontSize: "15px",
};

const dropdownButton = {
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  cursor: "pointer",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "#f9f9f9",
};

const dropdownList = {
  position: "absolute",
  top: "110%",
  left: 0,
  right: 0,
  maxHeight: "260px",
  overflowY: "auto",
  border: "1px solid #ccc",
  borderRadius: "10px",
  background: "#fff",
  zIndex: 100,
  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
};

const dropdownItem = {
  display: "flex",
  gap: "10px",
  padding: "12px",
  cursor: "pointer",
};

const carThumb = {
  width: "55px",
  height: "35px",
  objectFit: "cover",
  borderRadius: "6px",
};

const submitButton = {
  padding: "14px",
  background: "#0d47a1",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "16px",
};
