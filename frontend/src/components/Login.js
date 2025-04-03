import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Navbar from "./Navbar";
import FooterBottom from "./FooterBottom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const authenticatedUser = users.find(
      (user) => user.email === email && user.password === password
    );

    if (authenticatedUser) {
      console.log("Authenticated:", authenticatedUser);
      localStorage.setItem("loggedInUser", JSON.stringify(authenticatedUser));
      navigate("/dashboard");
    } else {
      console.log("Failed Login Attempt");
      alert("Invalid email or password. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-page">
        <div className="login-container">
          <div className="login-box">
            <h2>Hello, Welcome Back!</h2>
            <form onSubmit={handleLogin}>
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
              <button type="submit">Login</button>
            </form>
            <p>
              Don’t have an account?{" "}
              <span onClick={() => navigate("/signup")} className="signup-link">
                Sign Up
              </span>
            </p>
          </div>
        </div>
      </div>
      <FooterBottom />
    </>
  );
}

export default Login;