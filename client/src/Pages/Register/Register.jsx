import axios from "../../axiosConfig";
import styles from "./register.module.css";
import { useState, useRef } from "react";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
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
      await axios.post("/user/signup", {
        username: userNameValue,
        firstname: firstNameValue,
        lastname: lastNameValue,
        email: emailValue,
        password: passwordValue,
      });

      const { data } = await axios.post("/user/login", {
        email: emailValue,
        password: passwordValue,
      });
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error.message;
      setError(errorMessage);
    }
  };

  return (
    <section className={styles.registerPage}>
      <section className={styles.registerSection}>
        <form className={styles.form_container} onSubmit={handleSubmit}>
        
          {/* Error container preserves space */}
          <div className={styles.error_container}>
            {error && <p className={styles.error_text}>{error}</p>}
          </div>

          <h3 className={styles.form_title}>Join The Network</h3>
          <p className={styles.form_text}>
            Already have an account?{" "}
            <Link className={styles.form_link} to="/signin">
              Sign in
            </Link>
          </p>

          <div>
            <input
              className={styles.input_field}
              type="text"
              placeholder="username"
              ref={userNameDom}
            />
          </div>
          <br />
          <div className={styles.first_last}>
            <div className={styles.first_last_item}>
              <input
                className={styles.input_field}
                type="text"
                placeholder="first name"
                ref={firstNameDom}
              />
            </div>
            <div className={styles.first_last_item}>
              <input
                className={styles.input_field}
                type="text"
                placeholder="last name"
                ref={lastNameDom}
              />
            </div>
          </div>

          <br />
          <div>
            <input
              className={styles.input_field}
              type="email"
              placeholder="email"
              ref={emailDom}
            />
          </div>
          <br />
          <div className={styles.password_wrapper}>
            <input
              className={styles.input_field}
              type={passwordVisible ? "text" : "password"}
              placeholder="password"
              ref={passwordDom}
            />
            <div
              className={styles.password_toggle}
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? (
                <VisibilityOffOutlinedIcon />
              ) : (
                <VisibilityOutlinedIcon />
              )}
            </div>
          </div>

          <button className={styles.register_button} type="submit">
            Agree and Join
          </button>

          <p className={styles.form_text}>
            I agree to the{" "}
            <a className={styles.form_link} href="">
              privacy policy
            </a>{" "}
            and{" "}
            <a className={styles.form_link} href="">
              terms of service.
            </a>
          </p>
          <p className={styles.form_text}>
            <Link className={styles.form_link} to="/signin">
              Already have an account?
            </Link>
          </p>
        </form>
      </section>
    </section>
  );
};

export default Register;
