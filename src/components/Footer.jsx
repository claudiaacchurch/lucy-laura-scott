import React from "react";
import "../styles/Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <p>&copy; {currentYear} Lucy Laura Scott</p>
      <div className="footer-links">
        <a href="mailto:lucylaurascott@example.com">Email</a>
        <span>·</span>
        <a href="https://instagram.com/lucylaurascott" target="_blank" rel="noopener noreferrer">Instagram</a>
      </div>
    </footer>
  );
};

export default Footer;
