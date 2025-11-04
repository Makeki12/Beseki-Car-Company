import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ✅ Dynamic API base URL (auto switch between localhost & Render)
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://beseki-backend.onrender.com"  // Make sure this matches your actual backend URL
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
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
  const navigate = useNavigate();

  // ✅ Fetch data once on mount
  useEffect(() => {
    if (!token) {
      navigate("/admin-login");
      return;
    }
    fetchCarsData(setCars);
    fetchBookingsData(setBookings, token);
  }, [token, navigate]);

  // ✅ Sync filteredBookings with bookings and searchTerm
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

  // ---------- Fixed Handlers ----------
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
    if (!token) {
      alert("Please login first");
      navigate("/admin-login");
      return;
    }

    setLoading(true);
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

      console.log("🔄 Submitting car data...");
      
      const res = await fetch(url, {
        method,
        headers: { 
          Authorization: `Bearer ${token}` 
          // Don't set Content-Type for FormData - let browser set it
        },
        body: formData,
      });

      const result = await res.json();
      
      if (res.ok) {
        alert(editCarId ? "✅ Car updated successfully!" : "✅ Car added successfully!");
        setForm({ name: "", price: "", description: "" });
        setImages([]);
        setPreview([]);
        setEditCarId(null);
        await fetchCarsData(setCars);
      } else {
        alert("❌ Error: " + (result.error || "Unknown error"));
        console.error("Server error:", result);
      }
    } catch (error) {
      console.error("❌ Network error submitting car:", error);
      alert("Network error: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteCar(id) {
    if (!window.confirm("Are you sure you want to delete this car?")) return;
    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/cars/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        alert("✅ Car deleted successfully!");
        await fetchCarsData(setCars);
      } else {
        const err = await res.json();
        alert("❌ Error deleting car: " + (err.error || "Unknown error"));
      }
    } catch (error) {
      console.error("❌ Error deleting car:", error);
      alert("Network error: " + error.message);
    }
  }

  async function handleDeleteBooking(id) {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        alert("✅ Booking deleted successfully!");
        setBookings((prev) => prev.filter((b) => b._id !== id));
      } else {
        const err = await res.json();
        alert("❌ Error deleting booking: " + (err.error || "Unknown error"));
      }
    } catch (error) {
      console.error("❌ Error deleting booking:", error);
      alert("Network error: " + error.message);
    }
  }

  async function handleDeleteImage(carId, publicId) {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      // For Cloudinary images, we need to send the public_id to remove
      const formData = new FormData();
      formData.append("removeImages", JSON.stringify([publicId]));

      const res = await fetch(`${API_BASE_URL}/api/cars/${carId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        alert("✅ Image deleted successfully!");
        await fetchCarsData(setCars);
      } else {
        const err = await res.json();
        alert("❌ Error deleting image: " + (err.error || "Unknown error"));
      }
    } catch (error) {
      console.error("❌ Error deleting image:", error);
      alert("Network error: " + error.message);
    }
  }

  function handleEditCar(car) {
    setEditCarId(car._id);
    setForm({
      name: car.name,
      price: car.price,
      description: car.description || "",
    });
    setImages([]);
    setPreview(car.images?.map(img => img.url) || []);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancelEdit() {
    setEditCarId(null);
    setForm({ name: "", price: "", description: "" });
    setImages([]);
    setPreview([]);
  }

  function handleLogout() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  }

  // ✅ Helper to get image URL (handles both Cloudinary objects and strings)
  const getImageUrl = (img) => {
    if (!img) return null;
    if (typeof img === 'string') return img;
    return img.url || img.secure_url;
  };

  // ---------- UI ----------
  return (
    <div style={{ maxWidth: "1100px", margin: "20px auto", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ margin: 0 }}>Admin Dashboard</h2>
        <button
          onClick={handleLogout}
          style={{
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
      </div>

      {/* Add/Edit Car Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          marginBottom: "30px",
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "8px",
          background: "#fafafa",
        }}
      >
        <h3 style={{ margin: "0 0 10px 0", color: "#1976d2" }}>
          {editCarId ? "Edit Car" : "Add New Car"}
        </h3>
        
        <input
          name="name"
          placeholder="Car Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
        />
        <input
          name="price"
          placeholder="Price (Ksh)"
          type="number"
          value={form.price}
          onChange={handleChange}
          required
          style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          rows="3"
          style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px", resize: "vertical" }}
        />
        
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
            {editCarId ? "Add More Images" : "Car Images"}
          </label>
          <input 
            type="file" 
            accept="image/*" 
            multiple 
            onChange={handleImageChange}
            style={{ width: "100%" }}
          />
          <small style={{ color: "#666" }}>Select multiple images (JPEG, PNG)</small>
        </div>

        {/* Image Previews */}
        {(preview.length > 0 || (editCarId && cars.find(c => c._id === editCarId)?.images?.length > 0)) && (
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
              {editCarId ? "Current Images" : "Image Previews"}
            </label>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {/* Existing images when editing */}
              {editCarId && cars.find(c => c._id === editCarId)?.images?.map((img, idx) => (
                <div key={idx} style={{ position: "relative" }}>
                  <img
                    src={getImageUrl(img)}
                    alt={`Existing ${idx}`}
                    width="100"
                    height="80"
                    style={{ 
                      borderRadius: "5px", 
                      objectFit: "cover",
                      border: "2px solid #1976d2"
                    }}
                  />
                </div>
              ))}
              
              {/* New image previews */}
              {preview.map((src, idx) => (
                <img
                  key={`preview-${idx}`}
                  src={src}
                  alt={`preview ${idx}`}
                  width="100"
                  height="80"
                  style={{ 
                    borderRadius: "5px", 
                    objectFit: "cover",
                    border: "2px solid green"
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px 20px",
              background: editCarId ? "#1976d2" : "green",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              flex: 1
            }}
          >
            {loading ? "Processing..." : (editCarId ? "Update Car" : "Add Car")}
          </button>

          {editCarId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={loading}
              style={{
                padding: "12px 20px",
                background: "gray",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Cars Section */}
      <section style={{ marginBottom: "40px" }}>
        <h3 style={{ marginBottom: "20px", color: "#333" }}>Cars in Showroom ({cars.length})</h3>
        {cars.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666", padding: "20px" }}>No cars available.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
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
                <p style={{ fontSize: "0.9em", color: "#555" }}>{car.description}</p>

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
                          src={getImageUrl(img)}
                          alt={`${car.name} ${idx}`}
                          width="80"
                          height="60"
                          style={{
                            borderRadius: "8px",
                            objectFit: "cover",
                          }}
                        />
                        <button
                          onClick={() => handleDeleteImage(car._id, img.public_id)}
                          style={{
                            position: "absolute",
                            top: "-5px",
                            right: "-5px",
                            background: "red",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "20px",
                            height: "20px",
                            cursor: "pointer",
                            fontSize: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          title="Delete image"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => handleEditCar(car)}
                    style={{
                      background: "#1976d2",
                      color: "white",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      flex: 1
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCar(car._id)}
                    style={{
                      background: "#d32f2f",
                      color: "white",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      flex: 1
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bookings Section */}
      <section>
        <h3 style={{ marginBottom: "20px", color: "#333" }}>
          Test Drive Bookings ({filteredBookings.length})
        </h3>

        <input
          type="text"
          placeholder="Search by name, email, phone, or car..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            fontSize: "16px"
          }}
        />

        {filteredBookings.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666", padding: "20px" }}>
            {searchTerm ? "No matching bookings found." : "No bookings available."}
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
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
                <p><strong>Email:</strong> {booking.email}</p>
                <p><strong>Phone:</strong> {booking.phone}</p>
                <p>
                  <strong>Preferred Date:</strong>{" "}
                  {booking.preferredDate
                    ? new Date(booking.preferredDate).toLocaleDateString()
                    : "Not specified"}
                </p>
                
                {booking.car && (
                  <>
                    <h5 style={{ margin: "10px 0 5px 0", color: "#555" }}>
                      {booking.car.name}
                    </h5>
                    <p>
                      <strong>Price:</strong>{" "}
                      {booking.car.price
                        ? `Ksh ${Number(booking.car.price).toLocaleString()}`
                        : "N/A"}
                    </p>
                    {booking.car.images?.[0] && (
                      <img
                        src={getImageUrl(booking.car.images[0])}
                        alt={booking.car.name}
                        width="100%"
                        style={{
                          borderRadius: "8px",
                          marginTop: "5px",
                          objectFit: "cover",
                          maxHeight: "150px"
                        }}
                      />
                    )}
                  </>
                )}
                
                {booking.message && (
                  <p
                    style={{
                      marginTop: "10px",
                      fontStyle: "italic",
                      background: "#eef3ff",
                      padding: "8px",
                      borderRadius: "5px",
                      fontSize: "0.9em"
                    }}
                  >
                    "{booking.message}"
                  </p>
                )}

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
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
                      flex: 1
                    }}
                  >
                    📧 Email
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
                      flex: 1
                    }}
                  >
                    📞 Call
                  </a>
                </div>

                <button
                  onClick={() => handleDeleteBooking(booking._id)}
                  style={{
                    marginTop: "10px",
                    width: "100%",
                    background: "#d32f2f",
                    color: "white",
                    padding: "10px",
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
      </section>
    </div>
  );
}