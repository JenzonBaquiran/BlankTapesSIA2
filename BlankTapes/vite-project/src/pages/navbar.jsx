import React, { useState, useEffect } from "react";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PersonIcon from "@mui/icons-material/Person";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ onCartClick, cartCount }) => {
  const [showAccount, setShowAccount] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Fetch latest user from backend when modal opens
  useEffect(() => {
    if (showAccount) {
      fetch("http://localhost:1337/api/latest-user")
        .then(res => res.json())
        .then(data => setUser(data))
        .catch(() => setUser(null));
    }
  }, [showAccount]);

  const handleLogout = async () => {
    await fetch("http://localhost:1337/api/logout", { method: "POST" });
    setUser(null);
    setShowAccount(false);
    navigate("/");
  };

  const username = localStorage.getItem("username");

  return (
    <>
      <nav className="navbar">
        <div className="navbar-section navbar-links">
          <Link to="/home">HOME</Link>
          <Link to="/product">PRODUCTS</Link>
          <Link to="/customerorder">ORDERS</Link>
          <Link to="/myaccount">MY ACCOUNT</Link>
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
          <PersonOutlineOutlinedIcon
            className="navbar-icon"
            style={{ cursor: "pointer" }}
            onClick={() => setShowAccount(true)}
          />
        </div>
       
      </nav>
      {showAccount && (
        <div className="account-modal-overlay" onClick={() => setShowAccount(false)}>
          <div
            className="account-modal"
            onClick={e => e.stopPropagation()}
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 10,
              minWidth: 300,
              minHeight: 150,
              boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
              position: "fixed",
              top: "10%",
              right: "-1%",
              zIndex: 1000,
            }}
          >
            <button
              onClick={() => setShowAccount(false)}
              style={{
                position: "absolute",
                top: 12,
                right: 16,
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 22,
                color: "#888"
              }}
              aria-label="Close"
            >
              ×
            </button>
            {username ? (
              <>
                <div style={{ marginBottom: 16, marginTop: 12 }}>
                  <b>Logged in as:</b> {username}
                </div>
                <button onClick={handleLogout} style={{
                  background: "#151515",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "8px 18px",
                  cursor: "pointer"
                }}>Logout</button>
              </>
            ) : (
              <div style={{ marginTop: 32, textAlign: "center" }}>
                No account logged in
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;