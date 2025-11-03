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
        backgroundColor: "#f9f9f9",
        textAlign: "center",
      }}
    >
      <h2
        style={{
          fontSize: "2.5rem",
          marginBottom: "40px",
          color: "#0d47a1",
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
            // ✅ Get first image URL safely
            const imageUrl =
              car.images && car.images.length > 0
                ? car.images[0].url // <-- Access the URL from object
                : null;

            return (
              <div
                key={car._id}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
                  padding: "20px",
                  transition: "transform 0.3s, box-shadow 0.3s",
                }}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={car.name}
                    style={{
                      width: "100%",
                      height: "200px",
                      borderRadius: "10px",
                      objectFit: "cover",
                      marginBottom: "15px",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "200px",
                      borderRadius: "10px",
                      background: "#ddd",
                      marginBottom: "15px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#666",
                    }}
                  >
                    No Image Available
                  </div>
                )}

                <h3 style={{ margin: "10px 0", fontSize: "1.3rem" }}>
                  {car.name}
                </h3>
                <p
                  style={{
                    fontWeight: "bold",
                    color: "#0d47a1",
                    fontSize: "1.1rem",
                    margin: "5px 0",
                  }}
                >
                  ${car.price}
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
                  to={`/car/${car.id || car._id}`}
                  style={{
                    display: "inline-block",
                    padding: "10px 18px",
                    background: "#0d47a1",
                    color: "#fff",
                    borderRadius: "8px",
                    textDecoration: "none",
                    transition: "0.3s",
                  }}
                >
                  View Details →
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default FeaturedCars;
