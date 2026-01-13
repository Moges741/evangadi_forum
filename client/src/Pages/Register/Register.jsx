import axios from "../../Api/axiosConfig.js";
import styles from "./register.module.css";
import { useState, useRef, useContext } from "react";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AppState } from "../../App";
const Register = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const userNameDom = useRef();
  const firstNameDom = useRef();
  const lastNameDom = useRef();
  const emailDom = useRef();
  const passwordDom = useRef();
  const { setUser } = useContext(AppState);

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
if (
  userNameValue.length > 8
)
{
  setError("username should be < 9 chars! ");
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
              placeholder="Username"
              ref={userNameDom}
            />
          </div>
          <br />
          <div className={styles.first_last}>
            <div className={styles.first_last_item}>
              <input
                className={styles.input_field}
                type="text"
                placeholder="First Name"
                ref={firstNameDom}
              />
            </div>
            <div className={styles.first_last_item}>
              <input
                className={styles.input_field}
                type="text"
                placeholder="Last Name"
                ref={lastNameDom}
              />
            </div>
          </div>

          <br />
          <div>
            <input
              className={styles.input_field}
              type="email"
              placeholder="Email"
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
                <VisibilityOutlinedIcon />
              ) : (
                <VisibilityOffOutlinedIcon />
              )}
            </div>
          </div>

          <button className={styles.register_button} type="submit">
            Agree and Join
          </button>

          <p className={styles.form_text}>
            I agree to the{" "}
            <a
              className={styles.form_link}
              href="https://www.evangadi.com/legal/privacy/"
              target="_blank"
            >
              privacy policy
            </a>{" "}
            and{" "}
            <a
              className={styles.form_link}
              href="https://www.evangadi.com/legal/privacy/"
              target="_blank"
            >
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