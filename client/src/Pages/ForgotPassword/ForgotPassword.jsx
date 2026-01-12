import axios from "../../Api/axiosConfig";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import style from "./ForgotPassword.module.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        "/user/forgot-password",
        { email },
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success("If an account exists, a reset link has been sent!");
      setEmail(""); // clear input
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.forgotPasswordPage}>
      <div className={style.forgotPasswordBox}>
        <h2>Forgot Password</h2>
        <p>
          Enter your email address below, and we’ll send you a link to reset
          your password.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
