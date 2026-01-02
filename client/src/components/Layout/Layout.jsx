import React from 'react'
import { Route, Routes , Navigate} from "react-router-dom";
import Register from '../../Pages/Register/Register';
function Layout() {
  return (
    <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}

export default Layout