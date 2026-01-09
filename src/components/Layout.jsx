import React, { useState, useEffect } from "react";
import HeaderWrapper from "./Header/HeaderWrapper";
import MobileHeader from "./Header/MobileHeader/MobileHeader";
import Footer from "./Footer";
import "./Layout.css";

const Layout = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);


  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);


  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.body.classList.add("dark-mode");
    }
  }, []);


  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      document.body.classList.toggle("dark-mode", next);
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  return (
    <div className="app-layout">
      {isMobile ? (
        <MobileHeader />
      ) : (
        <HeaderWrapper
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
      )}

      <main className="main-content">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
