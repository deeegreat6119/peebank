import React from "react";
import { Link } from "react-router-dom";
import PeebankLogo from "../../assets/Peebank-logo.svg";

const Header = () => {
  return (
    <header className="bank-header">
      <nav className="header-container">
        <div className="header-logo">
          <img src={PeebankLogo} alt="PeeBank Logo"></img>
          <p
            style={{
              background: "linear-gradient(to right, #2d98da, #e74c3c)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            pee-Bank
          </p>
        </div>
        <div className="header-auth-buttons">
          <Link to="/sign-in">
            <button className="header-btn-login">Login</button>
          </Link>
          <Link to="/sign-up">
            <button className="header-btn-signup">Sign Up</button>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
