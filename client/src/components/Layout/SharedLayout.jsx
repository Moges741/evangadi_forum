import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import ChatWidget from "../ChatWidget/ChatWidget";

function SharedLayout() {
  return (
    <>
      <Header />
      <ProtectedRoute>
        <ChatWidget />
      </ProtectedRoute>
      <Outlet />
      <Footer />
    </>
  );
}

export default SharedLayout;
