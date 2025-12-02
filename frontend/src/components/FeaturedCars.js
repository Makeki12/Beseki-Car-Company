import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function FeaturedCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const BASE_URL = "https://beseki-car-company.onrender.com";

  // Read search text from URL ?search=something
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search")?.toLowerCase() || "";

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

  // --- SEARCH FILTER ---
  const filteredCars = cars.filter((car) => {
    const text =
      `${car.name} ${car.make || ""} ${car.model || ""} ${car.year || ""} ${car.description || ""}`
        .toLowerCase();

    return text.includes(searchQuery);
  });

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
        background: "linear-gradient(135deg, #f4f6f8 0%, #e0e7ff 100%)",
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

      {/* Show search results message */}
      {searchQuery && (
        <p style={{ marginBottom: "20px", color: "#0d47a1", fontSize: "1.1rem" }}>
          Showing results for: <strong>{searchQuery}</strong>
        </p>
      )}

      {filteredCars.length === 0 ? (
        <p>No cars match your search.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "30px",
            maxWidth: "1300px",
            margin: "0 auto",
          }}
        >
          {filteredCars.map((car) => {
            const imageUrl =
              car.images && car.images.length > 0 ? car.images[0].url : null;

            return (
              <div
                key={car._id}
                style={{
                  position: "relative",
                  backgroundColor: "#fff",
                  borderRadius: "15px",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: "420px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = "0 15px 30px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
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

                <div style={{ padding: "20px", textAlign: "left", flexGrow: 1 }}>
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

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ color: "#ffb400", marginBottom: "5px" }}>
                      ⭐⭐⭐⭐☆
                    </div>

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
                        marginBottom: "5px",
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

                {car.isNew && (
                  <span
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: "10px",
                      background: "#ff5722",
                      color: "white",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                    }}
                  >
                    New
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      <style>
        {`
          @media (max-width: 768px) {
            #cars img {
              height: 180px !important;
            }
          }
        `}
      </style>
    </section>
  );
}

export default FeaturedCars;
