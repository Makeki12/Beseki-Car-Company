import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function FeaturedCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = "https://beseki-car-company.onrender.com";

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/cars`);
        if (!res.ok) throw new Error(`Failed to fetch cars: ${res.status}`);
        const data = await res.json();
        setCars(data);
      } catch (err) {
        console.error("Error fetching cars:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  if (loading)
    return (
      <section style={{ textAlign: "center", padding: "50px" }}>
        <h3>Loading featured cars...</h3>
      </section>
    );

  if (error)
    return (
      <section style={{ textAlign: "center", padding: "50px", color: "red" }}>
        <h3>⚠️ Failed to load cars</h3>
        <p>{error}</p>
      </section>
    );

  return (
    <section
      id="cars"
      style={{
        padding: "60px 20px",
        backgroundColor: "#f4f6f8",
        textAlign: "center",
      }}
    >
      <h2
        style={{
          fontSize: "2.8rem",
          marginBottom: "50px",
          color: "#0d47a1",
          fontWeight: "bold",
        }}
      >
        🚘 Featured Cars
      </h2>

      {cars.length === 0 ? (
        <p>No cars available at the moment.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "30px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {cars.map((car) => {
            const imageUrl =
              car.images && car.images.length > 0 ? car.images[0].url : null;

            return (
              <div
                key={car._id}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "15px",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 15px 25px rgba(0,0,0,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 20px rgba(0,0,0,0.1)";
                }}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={car.name}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      transition: "transform 0.3s",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "200px",
                      background: "#ddd",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#666",
                      fontWeight: "bold",
                    }}
                  >
                    No Image
                  </div>
                )}

                <div style={{ padding: "20px", textAlign: "left" }}>
                  <h3
                    style={{
                      fontSize: "1.4rem",
                      marginBottom: "10px",
                      fontWeight: "600",
                      color: "#0d47a1",
                    }}
                  >
                    {car.name}
                  </h3>
                  <p
                    style={{
                      fontWeight: "bold",
                      color: "#ff5722",
                      fontSize: "1.1rem",
                      marginBottom: "10px",
                    }}
                  >
                    Ksh {Number(car.price).toLocaleString()}
                  </p>
                  <p
                    style={{
                      fontSize: "0.95rem",
                      color: "#555",
                      marginBottom: "15px",
                      minHeight: "50px",
                    }}
                  >
                    {car.description?.length > 60
                      ? car.description.substring(0, 60) + "..."
                      : car.description}
                  </p>

                  <Link
                    to={`/car/${car._id || car.id}`}
                    style={{
                      display: "inline-block",
                      padding: "10px 18px",
                      background: "#0d47a1",
                      color: "#fff",
                      borderRadius: "8px",
                      textDecoration: "none",
                      fontWeight: "bold",
                      transition: "0.3s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#0941a3")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#0d47a1")
                    }
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default FeaturedCars;
