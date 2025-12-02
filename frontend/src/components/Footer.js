import React from "react";

function Footer() {
  return (
    <footer style={{
      backgroundColor: "#0d47a1",
      color: "white",
      padding: "30px 20px",
      textAlign: "center",
    }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <p style={{ fontSize: "1.1rem", marginBottom: "10px" }}>
          📍 Beseki Car Company – Mombasa, Kenya
        </p>
        <p style={{ marginBottom: "10px" }}>📞 WhatsApp: 0722 617 521 | ✉️ Email: benkise26@gmail.com</p>
        <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
          &copy; {new Date().getFullYear()} Beseki Car Company Limited. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
