import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setMenuOpen(false);
    }
  };

  return (
    <header
      style={{
        background: "white",
        color: "#0d47a1",
        padding: "10px 20px",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        borderBottom: "1px solid #e0e0e0",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1300px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* Modernized Logo */}
        <h1
          style={{
            fontSize: "1.7rem",
            fontWeight: "800",
            letterSpacing: "1px",
            color: "#0d47a1",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          <span style={{ color: "#1976d2" }}>Beseki</span> Motors
        </h1>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            fontSize: "1.8rem",
            cursor: "pointer",
            color: "#0d47a1",
          }}
          className="hamburger-btn"
        >
          ☰
        </button>

        {/* Navigation & Search */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
          className={`nav-menu ${menuOpen ? "open" : ""}`}
        >
          {/* Navigation Links */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
            className="nav-links"
          >
            <Link to="/" style={linkStyle}>Home</Link>
            <Link to="/book-test-drive" style={linkStyle}>Book Test Drive</Link>
            {!isAdmin && <Link to="/admin/login" style={linkStyle}>Admin Login</Link>}
            {isAdmin && <Link to="/admin/dashboard" style={linkStyle}>Dashboard</Link>}
          </div>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #ccc",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <input
              type="text"
              placeholder="Search car..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: "8px 10px",
                border: "none",
                outline: "none",
                width: "180px",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "8px 12px",
                border: "none",
                background: "#1976d2",
                color: "white",
                cursor: "pointer",
              }}
            >
              🔍
            </button>
          </form>
        </nav>
      </div>

      {/* Responsive Styles */}
      <style>
        {`
          @media (max-width: 900px) {
            .hamburger-btn {
              display: block;
            }

            .nav-menu {
              display: none;
              flex-direction: column;
              width: 100%;
              margin-top: 10px;
              padding-bottom: 10px;
              background: white;
              border-top: 1px solid #ddd;
            }

            .nav-menu.open {
              display: flex;
            }

            .nav-links {
              flex-direction: column;
              width: 100%;
              text-align: center;
              gap: 10px;
            }

            form {
              width: 90%;
              margin: 0 auto;
              justify-content: center;
            }

            input {
              width: 70% !important;
            }
          }
        `}
      </style>
    </header>
  );
}

const linkStyle = {
  color: "#0d47a1",
  textDecoration: "none",
  fontWeight: "600",
  fontSize: "1rem",
  padding: "8px 10px",
  transition: "0.3s",
};

export default Header;
