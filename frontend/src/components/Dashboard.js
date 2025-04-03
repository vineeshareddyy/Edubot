import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//import FooterBottom from "./FooterBottom";

const edubotLogo = process.env.PUBLIC_URL + "/edubot-logo.png";

// Define styles outside the component
const styles = {
  pageContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#f4f4f4",
  },
  header: {
    display: "flex",
    alignItems: "center",
    padding: "8px 20px",
    backgroundColor: "#fff",
    borderBottom: "1px solid #ddd",
    height: "60px",
  },
  headerContent: {
    display: "flex",
    alignItems: "center",
    gap: "10px",  // Space between logo and text
  },
  logo: {
    height: "45px",
    width: "auto",
  },
  headerText: {
    margin: 0,
    fontSize: "24px",
    color: "#333",
  },
  
  contentContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: "40px",
    flexGrow: 1,
  },
  leftSection: {
    maxWidth: "50%",
  },
  rightSection: {
    maxWidth: "40%",
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  chatBtn: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  dashboardImageContainer: { // New container for the image
    width: "100%", // Full page width
    padding: "0 40px 40px 40px", // Match contentContainer padding, add bottom padding
    boxSizing: "border-box", // Include padding in width calculation
  },
  dashboardImage: {
    width: "100%", // Full width of its container (i.e., full page)
    height: "auto", // Maintain aspect ratio
    maxHeight: "200px", // Optional: limit height, adjust as needed
    objectFit: "cover", // Ensure image fits nicely
    borderRadius: "8px",
  },
};

const Dashboard = () => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js";
    script.async = true;
    script.onload = () => {
      console.log("Dialogflow script loaded!");
      setIsScriptLoaded(true);
    };
    script.onerror = (error) => {
      console.error("Error loading Dialogflow script:", error);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleChatNow = () => {
    navigate("/chat");
  };

  return (
    
    <div style={styles.pageContainer}>
    <header style={styles.header}>
      <div style={styles.headerContent}>
        <img src="/elogo.png" alt="EduBot Logo" style={styles.logo} />
        <h2 style={styles.headerText}>EduBot</h2>
      </div>
    </header>

      <div style={styles.contentContainer}>
        <div style={styles.leftSection}>
          <h1>Meet Edubot: Your AI Powered Student Assistance Chatbot</h1>
        </div>
        <div style={styles.rightSection}>
          <p>
            Edubot provides students with instant access to vital information
            about admissions, scholarships, and placements. With personalized
            assistance available.
          </p>
          <button style={styles.chatBtn} onClick={handleChatNow}>
            Chat Now
          </button>
        </div>
      </div>

      {/* Image container below contentContainer, above FooterBottom */}
      <div style={styles.dashboardImageContainer}>
        <img
          src="/dimg.png" // Direct path to public/ folder
          alt="Dashboard Illustration"
          style={styles.dashboardImage}
        />
      </div>

     {/* <FooterBottom /> */}
    </div>
  );
};

export default Dashboard;