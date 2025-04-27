import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaShieldAlt, FaLock } from 'react-icons/fa';
import PeebankLogo from '../../assets/Peebank-logo.svg'

const Footer = () => {
  return (
    <footer className="peebank-footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-grid">
          
          {/* Bank Info */}
          <div className="footer-column">
            <div className="header-logo">
                     <img src={PeebankLogo} alt="PeeBank Logo"></img>
                     <p>pee-Bank</p>
                    </div>
            <p className="footer-description">
              Your trusted digital banking partner offering secure financial solutions since 2023.
            </p>
            <div className="social-links">
              <a href="#"><FaFacebook /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaLinkedin /></a>
              <a href="#"><FaInstagram /></a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="footer-column">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="#">Personal Banking</Link></li>
              <li><Link to="#">Business Banking</Link></li>
              <li><Link to="#">Loans & Mortgages</Link></li>
              <li><Link to="#">Investments</Link></li>
              <li><Link to="#">About Us</Link></li>
            </ul>
          </div>
          
          {/* Services */}
          <div className="footer-column">
            <h3 className="footer-heading">Services</h3>
            <ul className="footer-links">
              <li><Link to="#">Mobile Banking</Link></li>
              <li><Link to="#">Online Banking</Link></li>
              <li><Link to="#">Debit Cards</Link></li>
              <li><Link to="#">Credit Cards</Link></li>
              <li><Link to="#">Insurance</Link></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div className="footer-column">
            <h3 className="footer-heading">Contact Us</h3>
            <address className="footer-contact">
              <p>123 Financial District</p>
              <p>San Francisco, CA 94103</p>
              <p>Email: <a href="mailto:info@peebank.com">info@peebank.com</a></p>
              <p>Phone: <a href="tel:+18005551234">(800) 555-1234</a></p>
            </address>
          </div>
        </div>
        
        {/* Security Badges */}
        {/* <div className="security-badges">
          <div className="badge">
            <FaShieldAlt className="badge-icon" />
            <span>FDIC Insured</span>
          </div>
          <div className="badge">
            <FaLock className="badge-icon" />
            <span>256-bit Encryption</span>
          </div>
        </div> */}
      </div>
      
      {/* Copyright */}
      <div className="footer-bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} PeeBank. All rights reserved.</p>
          <div className="legal-links">
            <Link to="#">Privacy Policy</Link>
            <Link to="#">Terms of Service</Link>
            <Link to="#">Disclosures</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;