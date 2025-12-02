import React from "react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section
      id="home"
      style={{
        position: "relative",
        minHeight: "80vh",
        width: "100%",
        backgroundImage: "url('/hero-bg.jpg')", // replace with your own image
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        textAlign: "center",
        padding: "0 1rem",
      }}
    >
      {/* Overlay */}
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

      {/* Hero content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "900px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5rem",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(2rem, 6vw, 3rem)",
            fontWeight: "bold",
            marginBottom: "0",
            textShadow: "2px 2px 10px rgba(0,0,0,0.7)",
          }}
        >
          Welcome to Beseki Car Company
        </h1>

        <p
          style={{
            fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
            lineHeight: "1.5",
            textShadow: "1px 1px 8px rgba(0,0,0,0.6)",
            marginBottom: "0",
            maxWidth: "650px",
          }}
        >
          Your trusted partner for quality new and used cars. Find your dream car today!
        </p>

        <Link
          to="#cars"
          style={{
            padding: "12px 30px",
            fontSize: "clamp(1rem, 2vw, 1.1rem)",
            backgroundColor: "#ffca28",
            color: "#0d47a1",
            fontWeight: "bold",
            textDecoration: "none",
            borderRadius: "50px",
            boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.3)";
          }}
        >
          Browse Featured Cars
        </Link>

        <p
          style={{
            marginTop: "0.5rem",
            fontSize: "clamp(0.9rem, 2vw, 1rem)",
            opacity: 0.9,
          }}
        >
          🚘 New arrivals every week – Don’t miss out!
        </p>
      </div>
    </section>
  );
}

export default Hero;
