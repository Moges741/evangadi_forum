import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../Api/axiosConfig";
import { toast } from "react-toastify";
import styles from "./ResetPassword.module.css";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
 const [showNewPassword, setShowNewPassword] = useState(false);
 const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      const res = await axios.post(
        `http://localhost:5500/api/user/reset-password/${token}`,
        { newPassword }
      );

      toast.success(res.data.message);
      navigate("/signin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h2 className={styles.title}>Reset Password</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.password_group}>
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              className={styles.input}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <span
              className={styles.toggle_password}
              onClick={() => setShowNewPassword((prev) => !prev)}
            >
              {showNewPassword ? (
                <VisibilityOutlinedIcon />
              ) : (
                <VisibilityOffOutlinedIcon />
              )}
            </span>
          </div>

          <div className={styles.password_group}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className={styles.input}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span
              className={styles.toggle_password}
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? (
                <VisibilityOutlinedIcon />
              ) : (
                <VisibilityOffOutlinedIcon />
              )}
            </span>
          </div>

          <button type="submit" className={styles.button}>
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
