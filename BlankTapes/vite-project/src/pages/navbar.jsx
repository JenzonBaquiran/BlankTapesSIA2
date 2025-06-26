import React from "react";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar = ({ onCartClick, cartCount }) => (
  <nav className="navbar">
    <div className="navbar-section navbar-links">
      <Link to="/home">HOME</Link>
      <Link to="/product">PRODUCTS</Link>
      <Link to="/customerorder">ORDERS</Link>
      <Link to="/about">ABOUT US</Link>
        </div>
      <div className="navbar-section navbar-logo">
      <Link to="/home">
        <img src="/src/img/logowhite.png" alt="BLANKTAPES" className="logo-img" />
      </Link>
    </div>
    <div className="navbar-section navbar-actions">
      <input className="navbar-search" type="text" placeholder="Search" />
      <button
        className="navbar-cart-btn"
        onClick={onCartClick}
        style={{
          position: "relative",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        <ShoppingCartOutlinedIcon className="navbar-icon" />
        {cartCount > 0 && (
          <span className="navbar-cart-badge">{cartCount}</span>
        )}
      </button>
      <PersonOutlineOutlinedIcon className="navbar-icon" />
    </div>
  </nav>
);

export default Navbar;