import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function FooterBottom() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>EduBot</h3>
          <p>Your 24/7 AI-powered educational assistant for admission-related queries and academic guidance.</p>
        </div>
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/services">Services</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: support@edubot.com</p>
          <p>Phone: (123) 456-7890</p>
          <p>Address: 123 Education Street</p>
        </div>

        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook"></i></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin"></i></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} EduBot. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default FooterBottom;