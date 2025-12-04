import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// ============================
// MAIN COMPONENT
// ============================
export default function BookTestDrive() {
  const location = useLocation();
  const preselectedCarId = location.state?.carId || "";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    message: "",
    carId: preselectedCarId,
  });

  const [cars, setCars] = useState([]);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const [showModal, setShowModal] = useState(false);

  const API_BASE =
    import.meta.env?.VITE_API_URL ||
    process.env.REACT_APP_API_URL ||
    "https://beseki-backend.onrender.com";

  // ============================
  // FETCH CARS
  // ============================
  useEffect(() => {
    fetch(`${API_BASE}/api/cars`)
      .then((res) => res.json())
      .then((data) => setCars(data))
      .catch(() => setStatus("⚠️ Error loading cars"));
  }, []);

  // Close dropdown if click outside
  useEffect(() => {
    const close = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  // ============================
  // FORM HANDLERS
  // ============================
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function selectCar(carId) {
    setForm({ ...form, carId });
    setDropdownOpen(false);
  }

  // ============================
  // KENYAN PHONE VALIDATION
  // ============================
  function isValidPhone(phone) {
    const pattern = /^(?:\+254|0)(?:7\d{8}|1\d{8})$/;
    return pattern.test(phone);
  }

  // ============================
  // SUBMIT BOOKING
  // ============================
  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);

    if (!isValidPhone(form.phone)) {
      setStatus("❌ Enter a valid Kenyan phone number (07xx or +2547xx)");
      return;
    }

    if (!form.carId) {
      setStatus("❌ Please select a car");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await res.json();

      if (!res.ok) {
        setStatus("❌ " + (result.error || "Booking failed"));
        setLoading(false);
        return;
      }

      // SUCCESS — Show Modal
      setShowModal(true);

      // Reset Form
      setForm({
        name: "",
        email: "",
        phone: "",
        preferredDate: "",
        message: "",
        carId: "",
      });
    } catch (err) {
      setStatus("⚠️ Server error");
    }

    setLoading(false);
  }

  const selectedCar = cars.find((c) => c._id === form.carId);

  // ============================
  // UI
  // ============================
  return (
    <>
      <div
        style={{
          maxWidth: "600px",
          margin: "40px auto",
          padding: "30px",
          borderRadius: "14px",
          background: "white",
          boxShadow: "0px 10px 25px rgba(0,0,0,0.1)",
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
            style={inputStyle}
          />

          <input
            name="email"
            type="email"
            placeholder="Email Address"
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

          {/* CAR DROPDOWN */}
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={dropdownButton}
            >
              {selectedCar ? (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <img
                    src={selectedCar.images?.[0]?.url}
                    alt={selectedCar.name}
                    style={{
                      width: "45px",
                      height: "35px",
                      objectFit: "cover",
                      borderRadius: "6px",
                    }}
                  />
                  <span>
                    {selectedCar.name} — Ksh{" "}
                    {Number(selectedCar.price).toLocaleString()}
                  </span>
                </div>
              ) : (
                <span style={{ color: "#888" }}>-- Select Car Model --</span>
              )}
              <span
                style={{
                  transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "0.3s",
                }}
              >
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
                      background:
                        car._id === form.carId ? "#e3f2fd" : "white",
                    }}
                  >
                    <img
                      src={car.images?.[0]?.url}
                      alt={car.name}
                      style={{
                        width: "55px",
                        height: "35px",
                        objectFit: "cover",
                        borderRadius: "6px",
                      }}
                    />
                    {car.name} — Ksh {Number(car.price).toLocaleString()}
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
            placeholder="Additional Message (optional)"
            value={form.message}
            onChange={handleChange}
            style={{ ...inputStyle, minHeight: "100px" }}
          />

          <button type="submit" style={submitButton} disabled={loading}>
            {loading ? "⏳ Sending..." : "Book Test Drive"}
          </button>
        </form>

        {status && (
          <p
            style={{
              marginTop: "18px",
              textAlign: "center",
              color: "red",
              fontWeight: "bold",
            }}
          >
            {status}
          </p>
        )}
      </div>

      {/* ======================= */}
      {/* SUCCESS MODAL */}
      {/* ======================= */}
      {showModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h2 style={{ marginBottom: "10px", color: "#0d47a1" }}>
              🎉 Booking Successful!
            </h2>
            <p style={{ fontSize: "16px" }}>
              Your test drive request has been submitted.  
              Our team will contact you soon.
            </p>

            <button
              onClick={() => setShowModal(false)}
              style={modalButton}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ============================
// STYLES
// ============================
const inputStyle = {
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  fontSize: "15px",
  outline: "none",
};

const dropdownButton = {
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  background: "#f8f8f8",
  cursor: "pointer",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const dropdownList = {
  position: "absolute",
  top: "110%",
  left: 0,
  right: 0,
  maxHeight: "260px",
  overflowY: "auto",
  background: "white",
  borderRadius: "10px",
  border: "1px solid #ccc",
  boxShadow: "0 5px 20px rgba(0,0,0,0.15)",
  zIndex: 100,
};

const dropdownItem = {
  padding: "12px",
  cursor: "pointer",
  display: "flex",
  gap: "10px",
  alignItems: "center",
};

const submitButton = {
  padding: "14px",
  borderRadius: "10px",
  border: "none",
  background: "#0d47a1",
  color: "white",
  fontSize: "16px",
  cursor: "pointer",
};

const modalOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  animation: "fadeIn 0.3s",
  zIndex: 5000,
};

const modalBox = {
  background: "white",
  padding: "30px",
  borderRadius: "14px",
  width: "90%",
  maxWidth: "400px",
  textAlign: "center",
  boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  animation: "popIn 0.3s",
};

const modalButton = {
  marginTop: "20px",
  padding: "12px 20px",
  background: "#0d47a1",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "16px",
};
