import React from "react";
import { Link } from "react-router-dom";
import jwtDecode from "jwt-decode";

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
        position: "sticky",
        top: 0,
        zIndex: 1000,
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(13, 71, 161, 0.85)",
        color: "white",
        padding: "15px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h1 style={{ margin: 0, fontSize: "1.5rem" }}>Beseki Car Company</h1>

      <nav style={{ display: "flex", alignItems: "center" }}>
        <Link
          to="/"
          style={{
            color: "white",
            marginRight: "20px",
            textDecoration: "none",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.color = "#ffca28")}
          onMouseLeave={(e) => (e.target.style.color = "white")}
        >
          Home
        </Link>

        <Link
          to="/book-test-drive"
          style={{
            color: "white",
            marginRight: "20px",
            textDecoration: "none",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.color = "#ffca28")}
          onMouseLeave={(e) => (e.target.style.color = "white")}
        >
          Book Test Drive
        </Link>

        {!isAdmin && (
          <Link
            to="/admin/login"
            style={{
              color: "white",
              marginRight: "20px",
              textDecoration: "none",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#ffca28")}
            onMouseLeave={(e) => (e.target.style.color = "white")}
          >
            Admin Login
          </Link>
        )}

        {isAdmin && (
          <Link
            to="/admin/dashboard"
            style={{
              color: "white",
              marginRight: "20px",
              textDecoration: "none",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#ffca28")}
            onMouseLeave={(e) => (e.target.style.color = "white")}
          >
            Admin Dashboard
          </Link>
        )}
      </nav>
    </header>
  );
}

export default Header;
