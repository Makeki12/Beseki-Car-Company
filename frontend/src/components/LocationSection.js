import React from "react";

function LocationSection() {
  return (
    <section
      id="location"
      style={{
        padding: "4rem 1rem",
        background: "linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%)",
        textAlign: "center",
      }}
    >
      <h2
        style={{
          fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
          marginBottom: "1rem",
          color: "#0d47a1",
          fontWeight: "bold",
        }}
      >
        Our Showroom Location
      </h2>
      <p
        style={{
          marginBottom: "2rem",
          color: "#555",
          fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
        }}
      >
        Visit us at our physical location below
      </p>

      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <iframe
          title="Beseki Car Company Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.8235970643314!2d39.656229773525425!3d-4.056366244925391!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x184013aacc895a07%3A0x8108a845f320b58d!2sBeseki%20Car%20Company%20Limited!5e0!3m2!1sen!2ske!4v1750666549849!5m2!1sen!2ske"
          width="100%"
          height="400"
          style={{
            border: "0",
            borderRadius: "12px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
          }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>

        <a
          href="https://www.google.com/maps/dir/?api=1&destination=Beseki+Car+Company+Limited"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            padding: "12px 24px",
            backgroundColor: "#0d47a1",
            color: "white",
            textDecoration: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            fontSize: "clamp(0.9rem, 2vw, 1rem)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0941a3")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0d47a1")}
        >
          Get Directions
        </a>
      </div>
    </section>
  );
}

export default LocationSection;
