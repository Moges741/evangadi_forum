import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "./Api/axiosConfig";
import { ToastContainer } from "react-toastify";
import AppRouter from "./routes/AppRouter";
import styles from "./App.module.css"; 

export const AppState = createContext();

function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  async function checkUser() {
    if (!token) {
      setLoadingUser(false);
      return;
    }

    try {
      const { data: user } = await axios.get("/user/check", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Fetch Profile Picture
      try {
        const { data: picData } = await axios.get("/user/profile-picture", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (picData.profilePicture) {
          user.profile_picture = picData.profilePicture;
        }
      } catch (error) {
        console.error("Failed to fetch profile picture:", error);
      }

      setUser(user);
    } catch (error) {
      console.error("User check failed:", error.response || error);
      localStorage.removeItem("token");
      navigate("/signin");
    } finally {
      setLoadingUser(false);
    }
  }

  useEffect(() => {
    checkUser();
  }, [token]);

  if (loadingUser) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.loader}></div>
      </div>
    );
  }

  return (
    <AppState.Provider value={{ user, setUser }}>
      <AppRouter />
      <ToastContainer position="top-right" autoClose={2000} />
    </AppState.Provider>
  );
}

export default App;
