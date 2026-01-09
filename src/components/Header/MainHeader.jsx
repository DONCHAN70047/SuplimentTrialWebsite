import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const MainHeader = () => {
  return (
    <div className="main-header">
      <nav>
        <Link to="#">ALL PRODUCTS ▾</Link>
        <Link to="#">OFFERS</Link>
        <Link to="#">STORES ▾</Link>
        <Link to="#">OUR STORY</Link>
        <Link to="#">AUTHENTICITY ▾</Link>
        <Link to="#">CHAT SUPPORT</Link>
        <Link to="#">BUSINESS ENQUIRY</Link>
      </nav>
    </div>
  );
};

export default MainHeader;
