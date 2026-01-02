import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Register from "./Pages/Register/Register";
import Login from "./Pages/Login/Login";
import axios from "./Api/axiosConfig";

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

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
    <div>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/*" element={<Layout />} />
      </Routes>
    </div>
  );
}

export default App;
