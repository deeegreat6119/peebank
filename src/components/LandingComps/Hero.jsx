import React from "react";
import landingbackground from "../../assets/landingpageback.png";

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <h1
            style={{
              background: "linear-gradient(to right, #2d98da, #e74c3c)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Banking Made Simple, Secure, and Smart
          </h1>
          <p
            style={{
              background: "linear-gradient(to right, #2d98da, #e74c3c)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Experience next-generation financial services with competitive rates
            and cutting-edge security
          </p>
          <div className="hero-cta-buttons">
            <button className="hero-btn-primary">Open an Account</button>
            <button className="hero-btn-secondary">Learn More</button>
          </div>
        </div>
        <div className="hero-image">
          <img src={landingbackground} alt="Digital Banking" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
