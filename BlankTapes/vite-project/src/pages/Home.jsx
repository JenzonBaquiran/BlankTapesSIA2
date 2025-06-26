import React from 'react';
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import "./Navbar.css";
import "./Home.css";
import "./Footer.css";

function Home() {
  return (
    <div>
      <Navbar />
      <div className="banner-bg" style={{ marginTop: "60px", marginBottom: "60px" }}>
  
      </div>
      <Footer />
    </div>
  );
}

export default Home;