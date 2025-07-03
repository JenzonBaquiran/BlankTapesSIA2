import React from 'react';
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import "./Navbar.css";
import "./Home.css";
import "./Footer.css";

function Home() {
  return (
    <div className="home-responsive-container">
      <Navbar />
      <div className="banner-bg" style={{ marginTop: "60px", marginBottom: "60px" }}>
        {/* Add your banner or content here */}
        <div className="banner-content">
          SAMPLE LOOK
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;