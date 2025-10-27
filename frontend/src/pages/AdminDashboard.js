import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ✅ Detect backend dynamically (Render in production, localhost in dev)
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://beseki-car-company.onrender.com"
    : "http://localhost:5000";

// ------------------- Helper Fetch Functions -------------------
async function fetchCarsData(setCars) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/cars`);
    const data = await res.json();
    setCars(data);
  } catch (error) {
    console.error("❌ Error fetching cars:", error);
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
    console.error("❌ Error fetching bookings:", error);
  }
}

// ------------------- Component -------------------
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

  // ✅ Fetch data when component mounts
  useEffect(() => {
    fetchCarsData(setCars);
    fetchBookingsData(setBookings, token);
  }, [token]);

  // ✅ Filter bookings dynamically
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

  // ------------------- Form Handlers -------------------
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreview(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
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
        alert(editCarId ? "✅ Car updated successfully!" : "✅ Car added!");
        setForm({ name: "", price: "", description: "" });
        setImages([]);
        setPreview([]);
        setEditCarId(null);
        fetchCarsData(setCars);
      } else {
        const err = await res.json();
        alert("❌ Error: " + (err.error || "Unknown error"));
      }
    } catch (error) {
      console.error("❌ Error submitting car:", error);
      alert("Failed to connect to the server.");
    }
  };

  const handleEditCar = (car) => {
    setEditCarId(car._id);
    setForm({
      name: car.name,
      price: car.price,
      description: car.description,
    });
    setPreview(
      car.images?.map((img) => `${API_BASE_URL}${img}`) || []
    );
  };

  const handleDeleteCar = async (id) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/cars/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchCarsData(setCars);
      } else {
        const err = await res.json();
        alert("Error deleting car: " + (err.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditCarId(null);
    setForm({ name: "", price: "", description: "" });
    setImages([]);
    setPreview([]);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  // ------------------- UI -------------------
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

      {/* ------------ Add/Edit Car Form ------------ */}
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
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />

        {/* Preview newly added or existing images */}
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

      {/* ------------ Cars Display Section ------------ */}
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
              <h4 style={{ color: "#1976d2", marginBottom: "8px" }}>
                {car.name}
              </h4>
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
                    <img
                      key={idx}
                      src={`${API_BASE_URL}${img}`}
                      alt={car.name}
                      width="100%"
                      style={{
                        borderRadius: "8px",
                        maxHeight: "150px",
                        objectFit: "cover",
                      }}
                    />
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
    </div>
  );
}
