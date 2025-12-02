import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function BookTestDrive() {
  const location = useLocation();
  const preselectedCarId = location.state?.carId || "";

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

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function selectCar(carId) {
    setForm({ ...form, carId });
    setDropdownOpen(false);
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
          carId: preselectedCarId,
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

  const selectedCar = cars.find((c) => c._id === form.carId);

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        padding: "30px",
        borderRadius: "14px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        background: "#ffffff",
        fontFamily: "Arial, sans-serif",
        transition: "all 0.3s ease",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#0d47a1",
          fontSize: "28px",
          marginBottom: "25px",
        }}
      >
        🚗 Book a Test Drive
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            fontSize: "15px",
            outline: "none",
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
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            fontSize: "15px",
            outline: "none",
          }}
        />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          required
          style={{
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            fontSize: "15px",
            outline: "none",
          }}
        />

        {/* Custom dropdown */}
        <div
          ref={dropdownRef}
          style={{ position: "relative", width: "100%" }}
        >
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              padding: "14px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#f9f9f9",
            }}
          >
            {selectedCar ? (
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                {selectedCar.images?.[0]?.url && (
                  <img
                    src={selectedCar.images[0].url}
                    alt={selectedCar.name}
                    style={{
                      width: "40px",
                      height: "30px",
                      objectFit: "cover",
                      borderRadius: "6px",
                    }}
                  />
                )}
                <span>{selectedCar.name} — Ksh {Number(selectedCar.price).toLocaleString()}</span>
              </div>
            ) : (
              <span style={{ color: "#999" }}>-- Select Car Model --</span>
            )}
            <span
              style={{
                transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s",
              }}
            >
              ▼
            </span>
          </div>

          {dropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "110%",
                left: 0,
                right: 0,
                maxHeight: "250px",
                overflowY: "auto",
                border: "1px solid #ccc",
                borderRadius: "10px",
                background: "#fff",
                zIndex: 100,
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                transition: "all 0.3s",
              }}
            >
              {cars.map((car) => (
                <div
                  key={car._id}
                  onClick={() => selectCar(car._id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px",
                    cursor: "pointer",
                    background:
                      car._id === form.carId ? "#e3f2fd" : "#fff",
                    transition: "0.2s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#f0f0f0"}
                  onMouseLeave={(e) => e.currentTarget.style.background =
                    car._id === form.carId ? "#e3f2fd" : "#fff"}
                >
                  {car.images?.[0]?.url && (
                    <img
                      src={car.images[0].url}
                      alt={car.name}
                      style={{
                        width: "50px",
                        height: "35px",
                        objectFit: "cover",
                        borderRadius: "6px",
                      }}
                    />
                  )}
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
          style={{
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            fontSize: "15px",
            outline: "none",
          }}
        />

        <textarea
          name="message"
          placeholder="Additional Message"
          value={form.message}
          onChange={handleChange}
          style={{
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            minHeight: "100px",
            fontSize: "15px",
            outline: "none",
          }}
        />

        <button
          type="submit"
          style={{
            padding: "14px",
            background: "#0d47a1",
            color: "white",
            border: "none",
            borderRadius: "10px",
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
            fontSize: "15px",
          }}
        >
          {status}
        </p>
      )}
    </div>
  );
}
