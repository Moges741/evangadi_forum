import React from 'react'
import { Route, Routes } from "react-router-dom";
import Landing from '../../Pages/Landing/Landing';

function Layout() {
  return (
    <Routes>
      <Route path="/:mode" element={<Landing />} />
    </Routes>
  );
}

export default Layout