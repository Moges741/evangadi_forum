import { createContext, useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import axios from "./Api/axiosConfig";
import { ToastContainer } from "react-toastify";

export const AppState = createContext();

function App() {
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  async function checkUser() {
    if (!token) {
      navigate("/signin");
      return;
    }

    try {
      const { data } = await axios.get("/user/check", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(data);
    } catch (error) {
      console.error(error.response);
      localStorage.removeItem("token");
      navigate("/signin");
    }
  }

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <AppState.Provider value={{ user, setUser }}>
      <Layout />
      <ToastContainer position="top-right" autoClose={2000} />
    </AppState.Provider>
  );
}

export default App;
