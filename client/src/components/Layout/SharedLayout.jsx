// import { Outlet } from "react-router-dom";
// import Header from "../../components/Header/Header";
// import Footer from "../../components/Footer/Footer";
// import ChatWidget from "../ChatWidget/ChatWidget";

// function SharedLayout() {
  
//   return (
//     <>
//       <Header />
//       <ChatWidget />
//       <Outlet />
//       <Footer />
//     </>
//   );
// }

// export default SharedLayout;



import { Outlet, useLocation, Navigate } from "react-router-dom";
import {useContext} from 'react'
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ChatWidget from "../ChatWidget/ChatWidget";
import { AppState } from "../../App";

function SharedLayout() {
   const { user } = useContext(AppState); // logged-in user
  const location = useLocation();

  // Public routes that anyone can access
  const publicRoutes = [
    "/signin",
    "/signup",
    "/forgot-password",
    "/reset-password"
  ];

  // Check if current route is public
  const isPublicRoute = publicRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  // If user is not logged in and route is not public → redirect to signin
  if (!user && !isPublicRoute) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <>
      <Header />
      <ChatWidget />
      <Outlet />
      <Footer />
    </>
  );
}

export default SharedLayout;
