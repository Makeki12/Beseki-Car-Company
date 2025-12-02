import React, { useState } from "react";
import { Link } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

function Header() {
  const token = localStorage.getItem("token");
  let isAdmin = false;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      isAdmin = decoded.role === "admin";
    } catch (err) {
      console.error("Invalid token", err);
    }
  }

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      style={{
        background: "linear-gradient(90deg, #0d47a1 0%, #1976d2 100%)",
        color: "white",
        padding: "10px 20px",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
          Beseki Car Company
        </h1>

        {/* Hamburger for mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            color: "white",
            fontSize: "1.5rem",
            cursor: "pointer",
          }}
          className="hamburger-btn"
        >
          ☰
        </button>

        <nav
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: "10px",
            justifyContent: "center",
            alignItems: "center",
            width: menuOpen ? "100%" : "auto",
          }}
        >
          <Link to="/" style={linkStyle}>
            Home
          </Link>
          <Link to="/book-test-drive" style={linkStyle}>
            Book Test Drive
          </Link>
          {!isAdmin && (
            <Link to="/admin/login" style={linkStyle}>
              Admin Login
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin/dashboard" style={linkStyle}>
              Dashboard
            </Link>
          )}
        </nav>
      </div>

      {/* Mobile menu styles */}
      <style>
        {`
          @media (max-width: 768px) {
            .hamburger-btn {
              display: block;
            }
            nav {
              flex-direction: column;
              display: ${menuOpen ? "flex" : "none"};
              width: 100%;
              margin-top: 10px;
            }
            nav a {
              margin-left: 0 !important;
              padding: 10px 0;
              width: 100%;
              text-align: center;
            }
          }
        `}
      </style>
    </header>
  );
}

const linkStyle = {
  color: "white",
  marginLeft: "20px",
  textDecoration: "none",
  fontWeight: "500",
  transition: "0.3s",
  padding: "5px 10px",
};

export default Header;
