import React, { useRef, useState } from "react";
import axios from "../../Api/axiosConfig";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const emailDom = useRef();
  const passwordDom = useRef();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

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
      console.log(error.response.data.msg);
      setError(error.response.data.msg);
      console.error(error.response?.data || error.message);
    }
  }

  return (
    <section className="login-container">
      {error && <p className="error">{error}</p>}
      <h2>Login to your account</h2>

      <p className="subtitle">
        Don’t have an account?
        <span onClick={() => navigate("/signup")}> Create a new account</span>
      </p>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input ref={emailDom} type="email" placeholder="Email address" />
        </div>

        <div className="input-group password-group">
          <input
            ref={passwordDom}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            👁
          </span>
        </div>

        <div className="forgot">
          <span onClick={() => navigate("/forgot-password")}>
            Forgot password?
          </span>
        </div>

        <button type="submit">Login</button>
      </form>
    </section>
  );
}

export default Login;
