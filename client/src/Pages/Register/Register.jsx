import axios from "../../axiosConfig";
import styles from "./register.module.css";
import { useState } from "react";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
const Register = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const userNameDom = useRef();
  const firstNameDom = useRef();
  const lastNameDom = useRef();
  const emailDom = useRef();
  const passwordDom = useRef();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userNameValue = userNameDom.current.value;
    const firstNameValue = firstNameDom.current.value;
    const lastNameValue = lastNameDom.current.value;
    const emailValue = emailDom.current.value;
    const passwordValue = passwordDom.current.value;
    if (
      !userNameValue ||
      !firstNameValue ||
      !lastNameValue ||
      !emailValue ||
      !passwordValue
    ) {
      setError("All fields are required");
      return;
    }
    try {
      await axios.post("/user/register", {
        username: userNameValue,
        firstname: firstNameValue,
        lastname: lastNameValue,
        email: emailValue,
        password: passwordValue,
      });
      navigate("/");
    } catch (error) {
      console.log(error.response);
      console.log(error.response.message)
      setError(error.response?.data.message);
    }
  };
  return (
    <section className={styles.registerPage}>
      <section className={styles.registerSection}>
        <form className={styles.form_container} onSubmit={handleSubmit}>
          {error && <p className={styles.error}>{error}</p>}
          <h3>Join The Network</h3>
          <p>
            Already have an account? <a href="/login">Sign in</a>
          </p>
          <div>
            <input type="text" placeholder="username" ref={userNameDom} />
          </div>
          <br />
          <div className={styles.first_last}>
            <div>
              <input type="text" placeholder="first name" ref={firstNameDom} />
            </div>
            <div>
              <input type="text" placeholder="last name" ref={lastNameDom} />
            </div>
          </div>

          <br />
          <div>
            <input type="email" placeholder="email" ref={emailDom} />
          </div>
          <br />
          <div>
            <div className={styles.password}>
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="password"
                ref={passwordDom}
              />
              <div
                className={styles.password_toggle}
                onClick={() => setPasswordVisible(!passwordVisible)}
                style={{ cursor: "pointer" }}
              >
                {passwordVisible ? (
                  <VisibilityOffOutlinedIcon />
                ) : (
                  <VisibilityOutlinedIcon />
                )}
              </div>
            </div>
          </div>
          <button className={styles.register_button} type="submit">
            Agree and Join
          </button>
          <p>
            I agree to the <a href="">privacy policy</a> and{" "}
            <a href="">terms of service.</a>
          </p>
          <p>
            <a href="">Already have an account?</a>
          </p>
        </form>
      </section>
    </section>
  );
};

export default Register;
