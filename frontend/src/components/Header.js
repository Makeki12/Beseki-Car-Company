import React from "react";
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

  return (
    <header
      style={{
        background: "linear-gradient(90deg, #0d47a1 0%, #1976d2 100%)",
        color: "white",
        padding: "15px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
      }}
    >
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
        Beseki Car Company
      </h1>
      <nav>
        <Link to="/" style={linkStyle}>Home</Link>
        <Link to="/book-test-drive" style={linkStyle}>Book Test Drive</Link>
        {!isAdmin && <Link to="/admin/login" style={linkStyle}>Admin Login</Link>}
        {isAdmin && <Link to="/admin/dashboard" style={linkStyle}>Dashboard</Link>}
      </nav>
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
