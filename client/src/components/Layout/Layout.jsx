import React from "react";
import { Route, Routes } from "react-router-dom";
import Header from "../Header/Header"; // Adjust path if needed

function Layout() {
  return (
    <>
      {/* Navbar always visible */}
      <Header />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<h1>Home Page</h1>} />
        <Route path="/login" element={<h1>Login Page</h1>} />
        <Route path="/how-it-works" element={<h1>How It Works</h1>} />
      </Routes>
    </>
  );
}

export default Layout;
