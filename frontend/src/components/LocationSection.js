import React from 'react';

function LocationSection() {
  return (
    <section
      id="location"
      style={{
        padding: '30px 15px',
        background: 'linear-gradient(135deg, #e3f2fd, #f5f5f5)',
        textAlign: 'center',
      }}
    >
      <h2 style={{ fontSize: '1.8rem', marginBottom: '10px', color: '#0d47a1' }}>
        Our Showroom Location
      </h2>
      <p style={{ marginBottom: '20px', color: '#555', fontSize: '1rem' }}>
        Visit us at our physical location below
      </p>

      <div style={{ width: '100%', maxWidth: '700px', margin: '0 auto' }}>
        <iframe
          title="Beseki Car Company Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.8235970643314!2d39.656229773525425!3d-4.056366244925391!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x184013aacc895a07%3A0x8108a845f320b58d!2sBeseki%20Car%20Company%20Limited!5e0!3m2!1sen!2ske!4v1750666549849!5m2!1sen!2ske"
          width="100%"
          height="300"
          style={{
            border: '0',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
          }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>

        <a
          href="https://www.google.com/maps/dir/?api=1&destination=Beseki+Car+Company+Limited"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            marginTop: '15px',
            padding: '10px 22px',
            backgroundColor: '#0d47a1',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '0.95rem',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#0941a3')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#0d47a1')}
        >
          Get Directions
        </a>
      </div>
    </section>
  );
}

export default LocationSection;
