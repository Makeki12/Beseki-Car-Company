import React from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

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
    <header style={{ backgroundColor: "#0d47a1", color: "white", padding: "20px" }}>
      <h1>Beseki Car Company Limited</h1>
      <nav style={{ marginTop: "10px" }}>
        <Link
          to="/"
          style={{ color: "white", marginRight: "20px", textDecoration: "none" }}
        >
          Home
        </Link>
        <Link
          to="/book-test-drive"
          style={{ color: "white", marginRight: "20px", textDecoration: "none" }}
        >
          Book Test Drive
        </Link>

        {/* If NOT logged in as admin → show Admin Login */}
        {!isAdmin && (
          <Link
            to="/admin/login"
            style={{ color: "white", marginRight: "20px", textDecoration: "none" }}
          >
            Admin Login
          </Link>
        )}

        {/* If logged in as admin → show Dashboard */}
        {isAdmin && (
          <Link
            to="/admin/dashboard"
            style={{ color: "white", marginRight: "20px", textDecoration: "none" }}
          >
            Admin Dashboard
          </Link>
        )}
      </nav>
    </header>
  );
}

export default Header;
