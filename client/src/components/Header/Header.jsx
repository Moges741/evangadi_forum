import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppState } from "../../App";
import logo from "../../assets/EvangadiLogo.jpeg";
import styles from "./header.module.css";

const Header = () => {
  const { user, setUser } = useContext(AppState);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
    setIsOpen(false);
  };

  return (
    <header className={styles.nav__bar}>
      <nav className={styles.navigation}>
        <div className={styles.container}>
          {/* Logo */}
          <div className={styles.evLogo__continer}>
            <Link to="/">
              <img src={logo} alt="Evangadi Logo" />
            </Link>
          </div>

          {/* Hamburger */}
          <div
            className={styles.hamburger}
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
          </div>

          {/* Links */}
          <div className={`${styles.nav__links} ${isOpen ? styles.open : ""}`}>
            <Link to="/" className={styles.navLink} onClick={() => setIsOpen(false)}>
              Home
            </Link>

            <Link
              to="/howitworks"
              className={styles.navLink}
              onClick={() => setIsOpen(false)}
            >
              How it works
            </Link>

            {user ? (
              <button className={styles.nav_butn} onClick={handleLogout}>
                LOG OUT
              </button>
            ) : (
              <Link to="/signin" onClick={() => setIsOpen(false)}>
                <button className={styles.nav_butn}>SIGN IN</button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
