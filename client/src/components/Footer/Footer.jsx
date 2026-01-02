import React from "react";
import "./footer.module.css";
import logo from "../../assets/10002.png";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <img src={logo} alt="Evangadi Logo" className="footer-logo" />
          <div className="social-icons">
            <a href="#">
              <FaFacebookF />
            </a>
            <a href="#">
              <FaInstagram />
            </a>
            <a href="#">
              <FaYoutube />
            </a>
          </div>
        </div>
        <div className="footer-section">
          <h4>Useful Links</h4>
          <ul>
            <li>
              <a href="#">How it Works</a>
            </li>
            <li>
              <a href="#">Terms of Service</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contact Info</h4>
          <ul>
            <li>
              <a href="#">Evangadi Networks</a>
            </li>
            <li>
              <a href="mailto:support@evangadi.com">support@evangadi.com</a>
            </li>
            <li>
              <a href="tel:+12023862702">+1-202-386-2702</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
