import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import Navbar from "./Navbar";
import FooterBottom from "./FooterBottom";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    if (!fullName || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    // Retrieve stored users from localStorage (if any) or initialize an empty array
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if the email is already registered
    if (users.some((user) => user.email === email)) {
      alert("User already exists! Please login.");
      navigate("/login");
      return;
    }

    // Add new user to the users array
    const newUser = { fullName, email, password };
    users.push(newUser);

    // Store the updated users array in localStorage
    localStorage.setItem("users", JSON.stringify(users));

    alert("Signup successful! Please login.");
    navigate("/login");
  };

  return (
    <>
      <Navbar />
      <div className="signup-page">
        <div className="signup-container">
          <div className="signup-box">
            <h2>Sign Up</h2>
            <form onSubmit={handleSignup}>
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Sign Up</button>
            </form>
            <p>
              Already have an account?{" "}
              <span onClick={() => navigate("/login")} className="signin-link">
                Login
              </span>
            </p>
          </div>
        </div>
        <div className="signup-image">
          <img src="/simg.png" alt="Signup Illustration" />
        </div>
      </div>
      <FooterBottom />
    </>
  );
};

export default Signup;