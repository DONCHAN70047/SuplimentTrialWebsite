import React, { useEffect, useState } from "react";
import { FaBars, FaSearch, FaHeadset, FaWallet, FaShoppingBag } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./MobileHeader.css";

const MobileHeader = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  if (!isMobile) return null;

  return (
    <header className="mb-mobile-header">
      <div className="mb-top-row">
        <FaBars className="mb-icon" />
        <img src="/logo.jpg" alt="Logo" className="mb-logo" />
        <div className="mb-icons">
          <FaHeadset />
          <FaWallet />
          <div className="mb-bag">
            <FaShoppingBag />
            <span className="mb-badge">0</span>
          </div>
        </div>
      </div>


      <div className="mb-search">
        <FaSearch className="mb-search-icon" />
        <input
          type="text"
          placeholder="Type a product name. e.g. Biozyme."
        />
      </div>
    </header>
  );
};

export default MobileHeader;
