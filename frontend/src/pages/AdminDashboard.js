import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://beseki-car-company.onrender.com"
    : "http://localhost:5000";

// ---------- Helper functions ----------
async function fetchCarsData(setCars) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/cars`);
    if (!res.ok) throw new Error("Failed to fetch cars");
    const data = await res.json();
    setCars(data);
  } catch (error) {
    console.error("Error fetching cars:", error);
  }
}

async function fetchBookingsData(setBookings, token) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/bookings`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch bookings");
    const data = await res.json();
    setBookings(data);
  } catch (error) {
    console.error("Error fetching bookings:", error);
  }
}

export default function AdminDashboard() {
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({ name: "", price: "", description: "" });
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [editCarId, setEditCarId] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch all data
  useEffect(() => {
    fetchCarsData(setCars);
    fetchBookingsData(setBookings, token);
  }, [token]);

  // Filter bookings dynamically
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = bookings.filter(
      (b) =>
        b.name?.toLowerCase().includes(term) ||
        b.email?.toLowerCase().includes(term) ||
        b.phone?.toLowerCase().includes(term) ||
        b.car?.name?.toLowerCase().includes(term)
    );
    setFilteredBookings(filtered);
  }, [bookings, searchTerm]);

  // ---------- Handlers ----------
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleImageChange(e) {
    const files = Array.from(e.target.files);
    setImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreview(previews);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("description", form.description);
    images.forEach((file) => formData.append("images", file));

    try {
      const url = editCarId
        ? `${API_BASE_URL}/api/cars/${editCarId}`
        : `${API_BASE_URL}/api/cars`;
      const method = editCarId ? "PUT" : "POST";

      console.log("➡️ Sending car data to:", url);

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save car");
      }

      alert(editCarId ? "✅ Car updated successfully!" : "🚗 Car added successfully!");
      setForm({ name: "", price: "", description: "" });
      setImages([]);
      setPreview([]);
      setEditCarId(null);
      await fetchCarsData(setCars);
    } catch (error) {
      console.error("Error submitting car:", error);
      alert("Error: " + error.message);
    }
  }

  async function handleDeleteCar(id) {
    if (!id) return alert("Invalid car ID.");

    if (!window.confirm("Are you sure you want to delete this car?")) return;

    try {
      console.log("🗑️ Deleting car with ID:", id);
      const res = await fetch(`${API_BASE_URL}/api/cars/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete car");
      }

      alert("✅ Car deleted successfully.");
      await fetchCarsData(setCars);
    } catch (error) {
      console.error("Error deleting car:", error);
      alert("Error deleting car: " + error.message);
    }
  }

  async function handleDeleteBooking(id) {
    if (!id) return alert("Invalid booking ID.");

    if (!window.confirm("Are you sure you want to delete this booking?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete booking");
      }

      alert("✅ Booking deleted successfully.");
      await fetchBookingsData(setBookings, token);
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Error deleting booking: " + error.message);
    }
  }

  function handleEditCar(car) {
    const carId = car._id || car.id;
    if (!carId) return alert("Invalid car ID — cannot edit.");

    console.log("✏️ Editing car with ID:", carId);
    setEditCarId(carId);
    setForm({
      name: car.name || "",
      price: car.price || "",
      description: car.description || "",
    });
    setImages([]);
    setPreview([]);
  }

  function handleCancelEdit() {
    setEditCarId(null);
    setForm({ name: "", price: "", description: "" });
    setImages([]);
    setPreview([]);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  }

  // ---------- UI ----------
  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "20px auto",
        padding: "20px",
        overflowX: "hidden", // ✅ prevent horizontal scroll
        boxSizing: "border-box", // ✅ fix alignment with padding
      }}
    >
      <h2 style={{ textAlign: "center" }}>Admin Dashboard</h2>

      <button
        onClick={handleLogout}
        style={{
          marginBottom: "20px",
          padding: "10px 20px",
          background: "#d32f2f",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>

      {/* Add/Edit Car Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginBottom: "30px",
          border: "1px solid #ccc",
          padding: "15px",
          borderRadius: "8px",
          background: "#fafafa",
          overflowX: "hidden", // ✅ prevent wide content
        }}
      >
        <input
          name="name"
          placeholder="Car Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="price"
          placeholder="Price (Ksh)"
          type="number"
          value={form.price}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          rows="3"
        />
        <input type="file" accept="image/*" multiple onChange={handleImageChange} />

        {preview.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              overflowX: "auto", // ✅ allow horizontal scroll for preview images only
            }}
          >
            {preview.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt="preview"
                style={{ borderRadius: "5px", maxWidth: "150px", height: "auto" }}
              />
            ))}
          </div>
        )}

        <button
          type="submit"
          style={{
            padding: "10px",
            background: editCarId ? "#1976d2" : "green",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          {editCarId ? "Update Car" : "Add Car"}
        </button>

        {editCarId && (
          <button
            type="button"
            onClick={handleCancelEdit}
            style={{
              padding: "10px",
              background: "gray",
              color: "white",
              border: "none",
              borderRadius: "5px",
              marginTop: "5px",
            }}
          >
            Cancel Edit
          </button>
        )}
      </form>

      {/* Cars Section */}
      <h3>Cars in Showroom</h3>
      {cars.length === 0 ? (
        <p>No cars available.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {cars.map((car) => {
            const carId = car._id || car.id;
            return (
              <div
                key={carId}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  padding: "15px",
                  background: "#fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  overflowX: "hidden", // ✅ prevent overflow
                }}
              >
                <h4 style={{ color: "#1976d2", marginBottom: "8px" }}>{car.name}</h4>
                <p>
                  <strong>Price:</strong> Ksh {Number(car.price).toLocaleString("en-KE")}
                </p>
                <p style={{ fontSize: "0.9em" }}>{car.description}</p>

                {car.images?.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                      marginTop: "10px",
                    }}
                  >
                    {car.images.map((img, idx) => {
                      const imgSrc =
                        typeof img === "string"
                          ? `${API_BASE_URL}${img}`
                          : img.url || `${API_BASE_URL}${img}`;
                      return (
                        <img
                          key={idx}
                          src={imgSrc}
                          alt={`${car.name} ${idx}`}
                          style={{
                            borderRadius: "8px",
                            maxHeight: "150px",
                            width: "100%",
                            height: "auto", // ✅ responsive
                            objectFit: "cover",
                          }}
                        />
                      );
                    })}
                  </div>
                )}

                <div style={{ marginTop: "10px" }}>
                  <button
                    onClick={() => handleEditCar(car)}
                    style={{
                      marginRight: "10px",
                      background: "#1976d2",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "4px",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCar(carId)}
                    style={{
                      background: "red",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "4px",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bookings Section */}
      <h3 style={{ marginTop: "40px" }}>Test Drive Bookings</h3>
      <input
        type="text"
        placeholder="Search bookings by car, name, email, or phone..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          boxSizing: "border-box",
        }}
      />

      {filteredBookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {filteredBookings.map((booking) => (
            <div
              key={booking._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "15px",
                background: "#fff",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                overflowX: "hidden", // ✅ prevent overflow
              }}
            >
              <h4 style={{ color: "#1976d2" }}>{booking.car?.name || "Unknown Car"}</h4>
              <p>
                <strong>Name:</strong> {booking.name}
              </p>
              <p>
                <strong>Email:</strong> {booking.email}
              </p>
              <p>
                <strong>Phone:</strong> {booking.phone}
              </p>
              <p>
                <strong>Date:</strong> {new Date(booking.date).toLocaleString()}
              </p>

              <div style={{ marginTop: "10px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <a
                  href={`tel:${booking.phone}`}
                  style={{
                    background: "green",
                    color: "white",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    textDecoration: "none",
                  }}
                >
                  📞 Call
                </a>
                <a
                  href={`mailto:${booking.email}`}
                  style={{
                    background: "#1976d2",
                    color: "white",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    textDecoration: "none",
                  }}
                >
                  ✉️ Email
                </a>
                <button
                  onClick={() => handleDeleteBooking(booking._id)}
                  style={{
                    background: "red",
                    color: "white",
                    padding: "5px 10px",
                    border: "none",
                    borderRadius: "5px",
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
