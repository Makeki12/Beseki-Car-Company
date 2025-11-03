import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

function CarDetails() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [fullscreenIndex, setFullscreenIndex] = useState(null);
  const navigate = useNavigate();

  const API_BASE =
    import.meta.env.VITE_API_URL || "https://beseki-backend.onrender.com";

  // ✅ Helper to handle both full and relative URLs
  const getImageUrl = (img) =>
    img.startsWith("http") ? img : `${API_BASE}${img}`;

  useEffect(() => {
    async function fetchCar() {
      try {
        const res = await fetch(`${API_BASE}/api/cars/${id}`);
        if (!res.ok) throw new Error("Failed to fetch car");
        const data = await res.json();
        setCar(data);
      } catch (err) {
        console.error("Error fetching car details:", err);
      }
    }
    fetchCar();
  }, [id, API_BASE]);

  if (!car) {
    return (
      <p style={{ textAlign: "center", marginTop: "20px", fontSize: "18px" }}>
        Loading car details...
      </p>
    );
  }

  const handleBookTestDrive = () => {
    navigate("/book-test-drive", { state: { carName: car.name, carId: car._id } });
  };

  const handleNext = () => {
    if (car.images && fullscreenIndex !== null) {
      setFullscreenIndex((prev) => (prev + 1) % car.images.length);
    }
  };

  const handlePrev = () => {
    if (car.images && fullscreenIndex !== null) {
      setFullscreenIndex(
        (prev) => (prev - 1 + car.images.length) % car.images.length
      );
    }
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "30px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        background: "#fff",
      }}
    >
      <h2 style={{ marginBottom: "20px", color: "#0d47a1" }}>{car.name}</h2>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {/* ✅ Image Gallery */}
        {car.images && car.images.length > 0 ? (
          <div
            style={{ flex: "1", display: "flex", flexWrap: "wrap", gap: "10px" }}
          >
            {car.images.map((img, idx) => (
              <img
                key={idx}
                src={getImageUrl(img)}
                alt={`${car.name} ${idx}`}
                style={{
                  width: "180px",
                  height: "120px",
                  borderRadius: "8px",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
                onClick={() => setFullscreenIndex(idx)}
              />
            ))}
          </div>
        ) : (
          <p>No images available</p>
        )}

        {/* ✅ Car Info */}
        <div style={{ flex: "1", minWidth: "250px" }}>
          <p style={{ fontSize: "18px" }}>
            <strong>💲 Price:</strong> Ksh{" "}
            {Number(car.price).toLocaleString()}
          </p>
          <p style={{ fontSize: "16px", lineHeight: "1.5" }}>
            <strong>📌 Description:</strong> {car.description}
          </p>

          <button
            onClick={handleBookTestDrive}
            style={{
              marginTop: "20px",
              padding: "12px 20px",
              background: "#0d47a1",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.background = "#08306b")}
            onMouseOut={(e) => (e.target.style.background = "#0d47a1")}
          >
            🚗 Book Test Drive
          </button>
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <Link to="/" style={{ color: "#0d47a1", textDecoration: "none" }}>
          ← Back to Cars
        </Link>
      </div>

      {/* ✅ Fullscreen Lightbox */}
      {fullscreenIndex !== null && (
        <div
          onClick={() => setFullscreenIndex(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.9)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            cursor: "pointer",
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            style={{
              position: "absolute",
              left: "30px",
              fontSize: "30px",
              background: "transparent",
              border: "none",
              color: "white",
              cursor: "pointer",
            }}
          >
            ⬅
          </button>

          <img
            src={getImageUrl(car.images[fullscreenIndex])}
            alt="fullscreen"
            style={{ maxWidth: "90%", maxHeight: "90%", borderRadius: "10px" }}
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            style={{
              position: "absolute",
              right: "30px",
              fontSize: "30px",
              background: "transparent",
              border: "none",
              color: "white",
              cursor: "pointer",
            }}
          >
            ➡
          </button>
        </div>
      )}
    </div>
  );
}

export default CarDetails;
