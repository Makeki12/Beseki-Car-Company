import React, { useState, useEffect } from "react";

export default function BookTestDrive() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    carId: "", // ✅ matches backend field
    preferredDate: "", // ✅ matches backend field
    message: "",
  });

  const [cars, setCars] = useState([]);
  const [status, setStatus] = useState(null);

  // ✅ Use your live backend URL from environment variable
  const API_BASE =
    import.meta.env.VITE_API_URL || "https://beseki-backend.onrender.com";

  // ✅ Fetch available cars from backend
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

  // ✅ Handle form input changes
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // ✅ Handle booking submission
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
          carId: "",
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
        maxWidth: "500px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        background: "white",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#0d47a1" }}>Book a Test Drive</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
      >
        {/* Name */}
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />

        {/* Email */}
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />

        {/* Phone */}
        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          required
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />

        {/* ✅ Car dropdown from backend */}
        <select
          name="carId"
          value={form.carId}
          onChange={handleChange}
          required
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        >
          <option value="">-- Select Car Model --</option>
          {cars.map((car) => (
            <option key={car._id} value={car._id}>
              {car.name} — Ksh {Number(car.price).toLocaleString()}
            </option>
          ))}
        </select>

        {/* Preferred Date */}
        <input
          name="preferredDate"
          type="date"
          value={form.preferredDate}
          onChange={handleChange}
          required
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />

        {/* Optional Message */}
        <textarea
          name="message"
          placeholder="Additional Message"
          value={form.message}
          onChange={handleChange}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            minHeight: "80px",
          }}
        />

        {/* Submit Button */}
        <button
          type="submit"
          style={{
            padding: "10px",
            background: "#0d47a1",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Book Test Drive
        </button>
      </form>

      {/* ✅ Status message */}
      {status && (
        <p
          style={{
            marginTop: "15px",
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
