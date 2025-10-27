import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ✅ Dynamic API base URL (auto switch between localhost & Render)
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://beseki-car-company.onrender.com"
    : "http://localhost:5000";

// ---------- Helper functions ----------
async function fetchCarsData(setCars) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/cars`);
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

  // ✅ Fetch data once on mount
  useEffect(() => {
    fetchCarsData(setCars);
    fetchBookingsData(setBookings, token);
  }, [token]);

  // ✅ Sync filteredBookings with bookings and searchTerm
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = bookings.filter(
      (b) =>
        b.name.toLowerCase().includes(term) ||
        b.email.toLowerCase().includes(term) ||
        b.phone.toLowerCase().includes(term) ||
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

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        setForm({ name: "", price: "", description: "" });
        setImages([]);
        setPreview([]);
        setEditCarId(null);
        fetchCarsData(setCars);
      } else {
        const err = await res.json();
        alert("Error: " + (err.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error submitting car:", error);
    }
  }

  async function handleDeleteCar(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/cars/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchCarsData(setCars);
      else {
        const err = await res.json();
        alert("Error deleting car: " + (err.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  }

  async function handleDeleteBooking(id) {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setBookings((prev) => prev.filter((b) => b._id !== id));
      } else {
        const err = await res.json();
        alert("Error deleting booking: " + (err.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  }

  async function handleDeleteImage(carId, index) {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/cars/${carId}/images/${index}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) fetchCarsData(setCars);
      else {
        const err = await res.json();
        alert("Error deleting image: " + (err.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  }

  function handleEditCar(car) {
    setEditCarId(car._id);
    setForm({
      name: car.name,
      price: car.price,
      description: car.description,
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
    <div style={{ maxWidth: "1100px", margin: "20px auto", padding: "20px" }}>
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
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {preview.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt="preview"
                width="100"
                style={{ borderRadius: "5px" }}
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
          {cars.map((car) => (
            <div
              key={car._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "15px",
                background: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <h4 style={{ color: "#1976d2", marginBottom: "8px" }}>{car.name}</h4>
              <p>
                <strong>Price:</strong> Ksh{" "}
                {Number(car.price).toLocaleString("en-KE")}
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
                  {car.images.map((img, idx) => (
                    <div key={idx} style={{ position: "relative" }}>
                      <img
                        src={`${API_BASE_URL}${img}`}
                        alt={`${car.name} ${idx}`}
                        width="100%"
                        style={{
                          borderRadius: "8px",
                          maxHeight: "150px",
                          objectFit: "cover",
                        }}
                      />
                      <button
                        onClick={() => handleDeleteImage(car._id, idx)}
                        style={{
                          position: "absolute",
                          top: "5px",
                          right: "5px",
                          background: "rgba(255,0,0,0.8)",
                          color: "white",
                          border: "none",
                          borderRadius: "50%",
                          width: "22px",
                          height: "22px",
                          cursor: "pointer",
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
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
                  onClick={() => handleDeleteCar(car._id)}
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
          ))}
        </div>
      )}

      {/* ---------- Bookings ---------- */}
      <h3 style={{ marginTop: "40px" }}>Test Drive Bookings</h3>

      <input
        type="text"
        placeholder="Search by car, name, email, or phone..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      />

      {filteredBookings.length === 0 ? (
        <p>No matching bookings found.</p>
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
                background: "#f9f9f9",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <h4 style={{ color: "#1976d2", marginBottom: "8px" }}>{booking.name}</h4>
              <p>
                <strong>Email:</strong> {booking.email}
              </p>
              <p>
                <strong>Phone:</strong> {booking.phone}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {booking.preferredDate
                  ? new Date(booking.preferredDate).toLocaleDateString()
                  : "N/A"}
              </p>
              <h5>{booking.car?.name || "Car unavailable"}</h5>
              <p>
                <strong>Price:</strong>{" "}
                {booking.car?.price
                  ? `Ksh ${Number(booking.car.price).toLocaleString()}`
                  : "N/A"}
              </p>
              {booking.car?.images?.[0] && (
                <img
                  src={`${API_BASE_URL}${booking.car.images[0]}`}
                  alt={booking.car.name}
                  width="100%"
                  style={{
                    borderRadius: "8px",
                    marginTop: "5px",
                    objectFit: "cover",
                  }}
                />
              )}
              {booking.message && (
                <p
                  style={{
                    marginTop: "10px",
                    fontStyle: "italic",
                    background: "#eef3ff",
                    padding: "8px",
                    borderRadius: "5px",
                  }}
                >
                  “{booking.message}”
                </p>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "15px",
                }}
              >
                <a
                  href={`mailto:${booking.email}`}
                  style={{
                    background: "#1976d2",
                    color: "#fff",
                    padding: "8px 12px",
                    borderRadius: "5px",
                    textDecoration: "none",
                    textAlign: "center",
                    flex: 1,
                    marginRight: "8px",
                  }}
                >
                  Email
                </a>
                <a
                  href={`tel:${booking.phone}`}
                  style={{
                    background: "#43a047",
                    color: "#fff",
                    padding: "8px 12px",
                    borderRadius: "5px",
                    textDecoration: "none",
                    textAlign: "center",
                    flex: 1,
                  }}
                >
                  Call
                </a>
              </div>

              <button
                onClick={() => handleDeleteBooking(booking._id)}
                style={{
                  marginTop: "10px",
                  width: "100%",
                  background: "red",
                  color: "white",
                  padding: "8px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Delete Booking
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}