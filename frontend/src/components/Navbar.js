import React from "react";
import { Link } from "react-router-dom"; // Ensure Link is imported correctly
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link to="/" className="logo-container">
          <img src="elogo.png" alt="EduBot Logo" className="logo-img" />
          <span className="logo-text">EduBot</span>
        </Link>
      </div>

      {/* Left side of Navbar */}
      <div className="nav-left">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/about" className="nav-link">About Us</Link>
        <Link to="/services" className="nav-link">Services</Link>
      </div>
      
      {/* Right side of Navbar (Sign Up and Login Buttons) */}
      <div className="nav-right">
        <Link to="/signup" className="nav-button">Sign Up</Link> {/* Check this link */}
        <Link to="/login" className="nav-button">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;



