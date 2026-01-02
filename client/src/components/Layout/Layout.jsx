import React from "react";
import { Route, Routes } from "react-router-dom";
import Landing from "../../Pages/Landing/Landing";
import SharedLayout from "./SharedLayout";
// import Home from '../../Pages/Home/Home'
import HowItWorks from "../../Pages/HowItWorks/HowItWorks";
import NotFound from "../../Pages/NotFound/NotFound";

function Layout() {
  return (
    <Routes>
      <Route path="/" element={<SharedLayout />}>
        <Route index element={<></>} />
        <Route path="/:mode" element={<Landing />} />
        <Route path="/howitworks" element={<HowItWorks />} />
      </Route>
      <Route path="/404" element={<NotFound />} />
    </Routes>
  );
}

export default Layout;
