import React from "react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

function Footer() {
  return (
    <footer
      style={{
        background: "linear-gradient(135deg, #0d47a1, #0941a3)",
        color: "white",
        padding: "40px 20px",
        textAlign: "center",
      }}
    >
      <h2 style={{ marginBottom: "15px", fontSize: "1.5rem" }}>
        Beseki Car Company Limited
      </h2>
      <p style={{ marginBottom: "10px" }}>
        📍 Mombasa, Kenya | 📞 WhatsApp: 0722 617 521 | ✉️ Email: benkise26@gmail.com
      </p>

      <div style={{ margin: "15px 0" }}>
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ margin: "0 10px", color: "white", fontSize: "1.2rem" }}
        >
          <FaFacebookF />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ margin: "0 10px", color: "white", fontSize: "1.2rem" }}
        >
          <FaInstagram />
        </a>
        <a
          href="https://wa.me/0722617521"
          target="_blank"
          rel="noopener noreferrer"
          style={{ margin: "0 10px", color: "white", fontSize: "1.2rem" }}
        >
          <FaWhatsapp />
        </a>
      </div>

      <p style={{ marginTop: "20px", fontSize: "0.9rem" }}>
        &copy; {new Date().getFullYear()} Beseki Car Company Limited. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
