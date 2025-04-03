import React from 'react';
import Navbar from './Navbar';
import FooterBottom from './FooterBottom';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <>
      <Navbar />
      <div className="about-container">
        {/* Hero Section */}
        <div className="about-hero">
          <h1>About EduBot</h1>
          <p>Transforming Education Through AI Innovation</p>
        </div>

        {/* Mission Section */}
        <section className="mission-section">
          <div className="section-content">
            <h2>Our Mission</h2>
            <p>At EduBot, we're committed to revolutionizing the educational experience through innovative AI solutions. Our mission is to make quality education assistance accessible to students in Telangana, 24/7.</p>
          </div>
        </section>

        {/* Values Section */}
        <section className="values-section">
          <h2>Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <i className="fas fa-brain"></i>
              <h3>Innovation</h3>
              <p>Continuously evolving our AI technology to provide cutting-edge educational support.</p>
            </div>
            <div className="value-card">
              <i className="fas fa-users"></i>
              <h3>Accessibility</h3>
              <p>Making quality education support available to everyone, anywhere, anytime.</p>
            </div>
            <div className="value-card">
              <i className="fas fa-shield-alt"></i>
              <h3>Reliability</h3>
              <p>Delivering accurate and trustworthy information consistently.</p>
            </div>
            <div className="value-card">
              <i className="fas fa-graduation-cap"></i>
              <h3>Excellence</h3>
              <p>Striving for the highest standards in educational assistance.</p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        {/*<section className="team-section">
          <h2>Our Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-image">
                <img src="/team-member1.jpg" alt="Team Member" />
              </div>
              <h3>John Doe</h3>
              <p>Founder & CEO</p>
            </div>
            <div className="team-member">
              <div className="member-image">
                <img src="/team-member2.jpg" alt="Team Member" />
              </div>
              <h3>Jane Smith</h3>
              <p>AI Development Lead</p>
            </div>
            <div className="team-member">
              <div className="member-image">
                <img src="/team-member3.jpg" alt="Team Member" />
              </div>
              <h3>Mike Johnson</h3>
              <p>Education Director</p>
            </div>
          </div>
        </section>*/}
      </div>
      <FooterBottom />
    </>
  );
};

export default AboutUs;