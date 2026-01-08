import { useContext, useRef, useState } from "react";
import axios from "../../Api/axiosConfig";
import { useNavigate } from "react-router-dom";
import classes from "./Login.module.css";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { AppState } from "../../App";

function Login() {
  const navigate = useNavigate();
  const emailDom = useRef();
  const passwordDom = useRef();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useContext(AppState);

  async function handleSubmit(e) {
    e.preventDefault();
    const email = emailDom.current.value;
    const password = passwordDom.current.value;

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      const { data } = await axios.post("/user/login", {
        email,
        password,
      });
      localStorage.setItem("token", data.token);
      
      navigate("/");
    } catch (error) {
      const errorMessage = error?.response?.data?.msg || error.message;
      setError(errorMessage);
    }
  }

  return (
    <section className={classes.login_container}>
      <div className={classes.error_container}>
        {error && <p className={classes.error_text}>{error}</p>}
      </div>

      <h2 className={classes.title}>Login to your account</h2>

      <p className={classes.subtitle}>
        Don’t have an account?
        <span onClick={() => navigate("/register")}> Create a new account</span>
      </p>

      <form onSubmit={handleSubmit}>
        <div className={classes.input_group}>
          <input
            className={classes.input_field}
            ref={emailDom}
            type="email"
            placeholder="Email address"
          />
        </div>

        <div className={`${classes.input_group} ${classes.password_group}`}>
          <input
            className={classes.input_field}
            ref={passwordDom}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
          />
          <span
            className={classes.toggle_password}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <VisibilityOutlinedIcon />
            ) : (
              <VisibilityOffOutlinedIcon />
            )}
          </span>
        </div>

        <div className={classes.forgot}>
          <span onClick={() => navigate("/forgot-password")}>
            Forgot password?
          </span>
        </div>

        <button className={classes.submit_btn} type="submit">
          Login
        </button>
      </form>
    </section>
  );
}

export default Login;
