import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import Header from "./components/Header";
import Hero from "./components/Hero";
import FeaturedCars from "./components/FeaturedCars";
import LocationSection from "./components/LocationSection";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";

// Pages
import ContactForm from "./pages/ContactForm";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import CarDetails from "./pages/CarDetails"; // ✅ Fixed

function App() {
  return (
    <Router>
      <div style={{ fontFamily: "Arial, sans-serif" }}>
        {/* Common header for all pages */}
        <Header />

        <Routes>
          {/* Home Page */}
          <Route
            path="/"
            element={
              <>
                <Hero />
                <FeaturedCars />
                <LocationSection />
              </>
            }
          />

          {/* Book Test Drive Page */}
          <Route path="/book-test-drive" element={<ContactForm />} />

          {/* Car Details Page */}
          <Route path="/car/:id" element={<CarDetails />} />

          {/* Admin Pages */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
        </Routes>

        {/* Common footer for all pages */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
