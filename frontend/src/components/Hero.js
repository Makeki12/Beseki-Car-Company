import React from 'react';

function Hero() {
  return (
    <section id="home" style={{ textAlign: 'center', padding: '50px 20px', backgroundColor: '#e3f2fd' }}>
      <h2 style={{ fontSize: '2.5rem' }}>Welcome to Beseki Car Company</h2>
      <p style={{ fontSize: '1.2rem', margin: '20px 0' }}>
        Your trusted partner for quality new and used cars.
      </p>
      <button style={{
        padding: '10px 20px',
        fontSize: '1rem',
        backgroundColor: '#0d47a1',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      }}>
        Browse Cars
      </button>
    </section>
  );
}

export default Hero;
