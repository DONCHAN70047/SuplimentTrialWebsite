import React, { useEffect } from "react";
import { FaSearch, FaShoppingBag, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Header.css";

const TopHeader = () => {

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector(".top-header");
      if (header) {
        header.classList.toggle("scrolled", window.scrollY > 10);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="top-header">
      <div className="top-left">
        <img src="/logo.jpg" alt="Logo" className="logo" />
      </div>

      <div className="top-center">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Type a product name, e.g. Biozyme."
        />
      </div>

      <div className="top-right">
        <FaShoppingBag />
        <span className="cart-badge">0</span>

        <FaUser />
        <span className="user-text">Hello, User</span>
      </div>
    </div>
  );
};

export default TopHeader;
