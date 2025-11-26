import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

function CarDetails() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [error, setError] = useState(null);
  const [fullscreenIndex, setFullscreenIndex] = useState(null);
  const navigate = useNavigate();

  const API_BASE = "https://beseki-car-company.onrender.com"; // Your backend

  const getImageUrl = (img) => (img ? (typeof img === "string" ? img : img.url) : null);

  useEffect(() => {
    if (!id) {
      setError("Invalid car ID");
      return;
    }

    const fetchCar = async () => {
      try {
        console.log("🚗 Fetching car details for ID:", id);

        const res = await fetch(`${API_BASE}/api/cars/${id}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error("Car not found.");
          throw new Error(`Failed to fetch car (status ${res.status})`);
        }

        const data = await res.json();
        setCar(data);
        console.log("✅ Car fetched:", data);
      } catch (err) {
        console.error("❌ Error fetching car details:", err);
        setError(
          err.message.includes("CORS")
            ? "CORS issue: check backend allows requests from this frontend domain."
            : err.message
        );
      }
    };

    fetchCar();
  }, [id]);

  const handleBookTestDrive = () => {
    navigate("/book-test-drive", {
      state: { carName: car?.name, carId: car?._id || car?.id },
    });
  };

  const handleNext = () => {
    if (car?.images && fullscreenIndex !== null) {
      setFullscreenIndex((prev) => (prev + 1) % car.images.length);
    }
  };

  const handlePrev = () => {
    if (car?.images && fullscreenIndex !== null) {
      setFullscreenIndex((prev) => (prev - 1 + car.images.length) % car.images.length);
    }
  };

  if (error) {
    return (
      <div style={{ textAlign: "center", color: "red", padding: "50px", fontSize: "18px" }}>
        <p>⚠️ {error}</p>
        <Link to="/" style={{ color: "#0d47a1", textDecoration: "none" }}>
          ← Back to Cars
        </Link>
      </div>
    );
  }

  if (!car) {
    return <p style={{ textAlign: "center", marginTop: "20px", fontSize: "18px" }}>Loading car details...</p>;
  }

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
        {car.images && car.images.length > 0 ? (
          <div
            style={{
              flex: "1",
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              justifyContent: "center",
            }}
          >
            {car.images.map((img, idx) => (
              <img
                key={idx}
                src={getImageUrl(img)}
                alt={`${car.name} ${idx}`}
                style={{ width: "180px", height: "120px", borderRadius: "8px", objectFit: "cover", cursor: "pointer" }}
                onClick={() => setFullscreenIndex(idx)}
              />
            ))}
          </div>
        ) : (
          <p>No images available</p>
        )}

        <div style={{ flex: "1", minWidth: "250px" }}>
          <p style={{ fontSize: "18px" }}>
            <strong>💲 Price:</strong> Ksh {Number(car.price).toLocaleString() || "N/A"}
          </p>
          <p style={{ fontSize: "16px", lineHeight: "1.5" }}>
            <strong>📌 Description:</strong> {car.description || "No description available."}
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
            }}
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
