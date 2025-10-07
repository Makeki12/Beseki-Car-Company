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

  // ✅ Fetch available cars from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/cars")
      .then((res) => res.json())
      .then((data) => setCars(data))
      .catch((err) => console.error("Error fetching cars:", err));
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // ✅ Handle booking submission
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/bookings", {
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
      console.error(err);
      setStatus("⚠️ Server error. Please try again later.");
    }
  }

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
      <h2>Book a Test Drive</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        {/* Name */}
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        {/* Email */}
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        {/* Phone */}
        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          required
        />

        {/* ✅ Car dropdown from showroom */}
        <select
          name="carId"
          value={form.carId}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Car Model --</option>
          {cars.map((car) => (
            <option key={car._id} value={car._id}>
              {car.name} - Ksh {Number(car.price).toLocaleString()}
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
        />

        {/* Optional Message */}
        <textarea
          name="message"
          placeholder="Additional Message"
          value={form.message}
          onChange={handleChange}
        />

        {/* Submit Button */}
        <button
          type="submit"
          style={{
            padding: "10px",
            background: "#0d47a1",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          Book Test Drive
        </button>
      </form>

      {/* ✅ Status message */}
      {status && (
        <p
          style={{
            marginTop: "10px",
            color: status.startsWith("✅") ? "green" : "red",
          }}
        >
          {status}
        </p>
      )}
    </div>
  );
}
