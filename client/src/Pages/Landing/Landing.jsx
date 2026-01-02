import React from "react";
import { useParams, Navigate } from "react-router-dom";
import style from "./Landing.module.css";
// import About from '../About/About'

function Landing() {
  const { mode } = useParams();

  if (mode !== "signin" && mode !== "signup") {
    return <Navigate to="/signin" replace />;
  }

  const isSignup = mode === "signup";

  return (
    <section className={style.container}>
      <div className={style.containerContent}>
        <div className={style.sliderContainer}>
          <div
            className={style.sliderWrapper}
            style={{
              transform: isSignup ? "translateX(-50%)" : "translateX(0)",
            }}
          >
            <div className={style.formPane} aria-hidden={isSignup}>
              {/* <Login /> */}
              signin
            </div>
            <div className={style.formPane} aria-hidden={!isSignup}>
              {/* <Register /> */}
              signup
            </div>
          </div>
        </div>
        <div className={style.about}>
          {/* <About/> */} about
        </div>
      </div>
    </section>
  );
}

export default Landing;
