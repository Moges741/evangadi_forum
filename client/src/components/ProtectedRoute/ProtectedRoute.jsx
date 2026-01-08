import React from 'react'
import { Navigate } from 'react-router-dom';

function ProtectedRoute({children}) {
  const isAuthenticated = () => !!localStorage.getItem("token"); //boolean value is returned

  return isAuthenticated() ? children : <Navigate to="/signin" replace/>
}

export default ProtectedRoute