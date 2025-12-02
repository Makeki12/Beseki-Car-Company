import React from "react";

function Footer() {
  return (
    <footer style={{
      backgroundColor: '#0d47a1',
      color: 'white',
      padding: '3rem 1rem',
      textAlign: 'center'
    }}>
      <p style={{ fontSize: '1.1rem', marginBottom: '10px' }}>
        📍 Beseki Car Company Limited – Mombasa, Kenya
      </p>
      <p>📞 WhatsApp: 0722 617 521 | ✉️ Email: benkise26@gmail.com</p>
      <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>
        &copy; {new Date().getFullYear()} Beseki Car Company Limited. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
