import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function FeaturedCars() {
  const [cars, setCars] = useState([]);
  const BASE_URL = "http://localhost:5000"; // backend server

  useEffect(() => {
    fetch(`${BASE_URL}/api/cars`)
      .then((res) => res.json())
      .then((data) => setCars(data))
      .catch((err) => console.error("Error fetching cars:", err));
  }, []);

  return (
    <section
      id="cars"
      style={{
        padding: "60px 20px",
        backgroundColor: "#f9f9f9",
        textAlign: "center",
      }}
    >
      <h2
        style={{
          fontSize: "2.5rem",
          marginBottom: "40px",
          color: "#0d47a1",
        }}
      >
        🚘 Featured Cars
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "30px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {cars.map((car) => (
          <div
            key={car._id}
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
              padding: "20px",
              transition: "transform 0.3s, box-shadow 0.3s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.2)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.1)";
            }}
          >
            <img
            src={`${BASE_URL}${
            car.images && car.images.length > 0 
          ? car.images[0]   // show first image if multiple exist
         : car.image       // fallback for old single image cars
        }`}
        alt={car.name}
        style={{
        width: "100%",
        height: "200px",
       borderRadius: "10px",
       objectFit: "cover",
       marginBottom: "15px",
       }}
      />

            <h3 style={{ margin: "10px 0", fontSize: "1.3rem" }}>{car.name}</h3>
            <p
              style={{
                fontWeight: "bold",
                color: "#0d47a1",
                fontSize: "1.1rem",
                margin: "5px 0",
              }}
            >
              ${car.price}
            </p>
            <p
              style={{
                fontSize: "0.95rem",
                color: "#555",
                marginBottom: "15px",
                minHeight: "50px",
              }}
            >
              {car.description.length > 60
                ? car.description.substring(0, 60) + "..."
                : car.description}
            </p>

            <Link
              to={`/car/${car._id}`}
              style={{
                display: "inline-block",
                padding: "10px 18px",
                background: "#0d47a1",
                color: "#fff",
                borderRadius: "8px",
                textDecoration: "none",
                transition: "0.3s",
              }}
              onMouseOver={(e) => (e.target.style.background = "#08306b")}
              onMouseOut={(e) => (e.target.style.background = "#0d47a1")}
            >
              View Details →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedCars;
