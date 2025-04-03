import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import FooterBottom from "./components/FooterBottom";
import Signup from "./components/Signup"; 
import Login from "./components/Login"; 
import Dashboard from "./components/Dashboard"; 
import AboutUs from "./components/AboutUs"; 
import Services from "./components/Services"; 
import Chat from "./components/Chat";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./App.css";

// Home Component
function Home() {
  return (  
    <>
    <Navbar />
      {/* Banner Image */}
      <div className="banner">
        <img src="background.jpg" alt="Banner" className="banner-image" />
      </div>

      {/* Welcome Text */}
      <div className="welcome-container">
      <div className="welcome-text">
        <h1>Explore EduBot</h1>
        <p>
          EduBot is designed to assist students around the clock, providing
          instant answers to admission-related queries. With its advanced AI
          capabilities, it ensures a seamless experience for users.
        </p>
        <div className="robot-image-container">
            <img src="robot.png" alt="AI Robot" className="robot-image" />
          </div>
      </div>
      </div>
      <FooterBottom />
    </>
  );
}

// Protected Route for Dashboard
const ProtectedRoute = ({ element }) => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  return loggedInUser ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/services" element={<Services />} />
          <Route exact path="/Dashboard" element={<Dashboard />} />
          <Route exact path="/chat" element={<Chat/>} />

          
          {/* <Route exact path="/demo" element = {<Dashboard/>}/> */}
          {/* Protect the dashboard route */}

          {/* <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} /> */}
        </Routes>

        
      </div>
    </Router>
  );
}

export default App;
