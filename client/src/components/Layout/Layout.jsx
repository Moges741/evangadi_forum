import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Landing from "../../Pages/Landing/Landing";
import SharedLayout from "./SharedLayout";
import Home from "../../Pages/Home/Home";
import HowItWorks from "../../Pages/HowItWorks/HowItWorks";
import NotFound from "../../Pages/NotFound/NotFound";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import Askquestion from "../../Pages/Askquestion/Askquestion.jsx";

function Layout() {
  return (
    <Routes>
      <Route path="/" element={<SharedLayout />}>
        {/* Root route. redirect to home if logged in */}
        <Route
          index
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Protected route for Home */}
        <Route
          path="home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
{/* protected route for ask question page */}
        <Route
          path="ask"
          element={
            <ProtectedRoute>
              <Askquestion />
            </ProtectedRoute>
          }
        />

        {/* Landing page for signin/signup */}
        <Route path=":mode" element={<Landing />} />

        {/* Public page */}
        <Route path="howitworks" element={<HowItWorks />} />
        {/* catch-all redirect for any unknown route */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
      <Route path="/404" element={<NotFound />} />
    </Routes>
  );
}

export default Layout;
