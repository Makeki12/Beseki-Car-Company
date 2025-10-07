// src/components/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; // install with: npm install jwt-decode

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    // 🚫 No token → redirect to login
    return <Navigate to="/admin/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    // Check if role exists and is "admin"
    if (decoded.role !== "admin") {
      return <Navigate to="/" replace />; // 🚫 redirect non-admin users to homepage
    }

    // ✅ Valid admin → allow access
    return children;
  } catch (err) {
    console.error("Invalid token:", err);
    return <Navigate to="/admin/login" replace />;
  }
}
