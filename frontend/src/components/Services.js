import React from 'react';
import Navbar from './Navbar';
import FooterBottom from './FooterBottom';
import './Services.css';

const Services = () => {
  return (
    <>
      <Navbar />
      <div className="services-container">
        {/* Hero Section */}
        <div className="services-hero">
          <h1>Our Services</h1>
          <p>Comprehensive AI-Powered Educational Support</p>
        </div>

        {/* Main Services */}
        <section className="main-services">
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-robot"></i>
              </div>
              <h3>24/7 AI Chat Support</h3>
              <p>Get instant answers to your educational queries anytime, anywhere through our advanced AI chatbot.</p>
            
            </div>

            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-book-reader"></i>
              </div>
              <h3>Admission Guidance</h3>
              <p>Comprehensive support for admission processes, requirements, and documentation.</p>
             
            </div>

            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-calendar-check"></i>
              </div>
              <h3>Multilingual Support</h3>
              <p>Provides text and voice output in Telugu,Hindi and English languages.</p>
             
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2>Why Choose EduBot?</h2>
          <div className="features-grid">
            <div className="feature-item">
              <i className="fas fa-clock"></i>
              <h4>24/7 Availability</h4>
              <p>Access support whenever you need it</p>
            </div>
            <div className="feature-item">
              <i className="fas fa-bolt"></i>
              <h4>Instant Responses</h4>
              <p>Get immediate answers to your queries</p>
            </div>
            <div className="feature-item">
              <i className="fas fa-check-circle"></i>
              <h4>Accurate Information</h4>
              <p>Verified and up-to-date educational content</p>
            </div>
            <div className="feature-item">
              <i className="fas fa-lock"></i>
              <h4>Secure Platform</h4>
              <p>Your data is safe with us</p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="cta-section">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of students already benefiting from EduBot's services</p>
          <a href="/signup" className="cta-button">Sign Up Now</a>
        </section>
      </div>
      <FooterBottom />
    </>
  );
};

export default Services;