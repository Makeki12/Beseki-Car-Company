import React from "react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section
      id="home"
      style={{
        position: "relative",
        height: "80vh",
        backgroundImage: "url('/hero-bg.jpg')", // replace with your own image
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        textAlign: "center",
        padding: "0 20px",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1,
        }}
      ></div>

      <div style={{ position: "relative", zIndex: 2, maxWidth: "800px" }}>
        <h1 style={{
          fontSize: "3rem",
          fontWeight: "bold",
          marginBottom: "20px",
          textShadow: "2px 2px 10px rgba(0,0,0,0.7)",
        }}>
          Welcome to Beseki Car Company
        </h1>

        <p style={{
          fontSize: "1.3rem",
          marginBottom: "30px",
          lineHeight: "1.5",
          textShadow: "1px 1px 8px rgba(0,0,0,0.6)",
        }}>
          Your trusted partner for quality new and used cars. Find your dream car today!
        </p>

        <Link to="#cars" style={{
          padding: "12px 30px",
          fontSize: "1.1rem",
          backgroundColor: "#ffca28",
          color: "#0d47a1",
          fontWeight: "bold",
          textDecoration: "none",
          borderRadius: "50px",
          boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "scale(1.05)";
          e.target.style.boxShadow = "0 8px 20px rgba(0,0,0,0.4)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "scale(1)";
          e.target.style.boxShadow = "0 6px 15px rgba(0,0,0,0.3)";
        }}>
          Browse Featured Cars
        </Link>

        <p style={{ marginTop: "20px", fontSize: "1rem", opacity: 0.9 }}>
          🚘 New arrivals every week – Don’t miss out!
        </p>
      </div>
    </section>
  );
}

export default Hero;
