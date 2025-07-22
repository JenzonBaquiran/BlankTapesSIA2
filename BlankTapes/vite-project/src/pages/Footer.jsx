import React from "react";
import "./Footer.css";

import SevenElevenLogo from "../assets/7ELEBEN.png";
import BankLogo from "../assets/BPI.png";
import KahitSaanLogo from "../assets/KAHIT SAAN.png";
import CustomLogo from "../assets/ROST.png";
import SinilikhaLogo from "../assets/SINILIKHA.png"; // <-- Add this import

const Footer = () => (
  <footer className="footer">
    <div className="footer-left">
      <span className="footer-title">NEVER MISS A DROP</span>
      <input className="footer-input" type="email" placeholder="Email" />
      <button className="footer-arrow">&#8594;</button>
    </div>
    <div className="footer-right">
      <a
        href="http://192.168.9.63:5173"
        className="footer-icon"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={SevenElevenLogo} alt="7 Eleven" style={{ height: 20 }} />
      </a>
      <a
        href="http://192.168.8.201:5173/login"
        className="footer-icon"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={BankLogo} alt="Bank" style={{ height: 20 }} />
      </a>
      <a
        href="http://192.168.9.69:5173"
        className="footer-icon"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={KahitSaanLogo} alt="Kahit Saan" style={{ height: 20 }} />
      </a>
      <a
        href="http://192.168.9.207:5173"
        className="footer-icon"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={CustomLogo} alt="Custom" style={{ height: 20 }} />
      </a>
      <a
        href="http://192.168.9.48:5173"
        className="footer-icon"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={SinilikhaLogo} alt="Sinilikha" style={{ height: 20 }} />
      </a>
    </div>
  </footer>
);

export default Footer;