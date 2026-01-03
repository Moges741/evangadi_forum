import { createContext, useState } from "react";
import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Register from "./Pages/Register/Register";
import Login from "./Pages/Login/Login";
import axios from "./Api/axiosConfig";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";

export const AppState = createContext();
function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  async function checkUser() {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await axios.get("/users/check", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error(error.response);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <AppState.Provider value={{ user, setUser }}>
      <div>
        <Header />
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/*" element={<Layout />} />
        </Routes>
        <Footer />
      </div>
    </AppState.Provider>
  );
}

export default App;
