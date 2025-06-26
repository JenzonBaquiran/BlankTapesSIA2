import React from "react";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import "./Footer.css";

const Footer = () => (
  <footer className="footer">
    <div className="footer-left">
      <span className="footer-title">NEVER MISS A DROP</span>
      <input className="footer-input" type="email" placeholder="Email" />
      <button className="footer-arrow">&#8594;</button>
    </div>
    <div className="footer-right">
      <a href="#" className="footer-icon"><FacebookIcon /></a>
      <a href="#" className="footer-icon"><InstagramIcon /></a>
      <a href="#" className="footer-icon"><EmailOutlinedIcon /></a>
    </div>
  </footer>
);

export default Footer;