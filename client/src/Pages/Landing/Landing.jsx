import React from "react";
import { useParams, Navigate } from "react-router-dom";
import style from "./Landing.module.css";
import Register from "../Register/Register";
import Login from "../Login/Login";
import NotFound from "../NotFound/NotFound";
// import About from '../About/About'

function Landing() {
  const { mode } = useParams();

  if (mode !== "signin" && mode !== "signup") {
    return <Navigate to="/404" replace />;
    // return <NotFound/>
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
              <Login />
              
            </div>
            <div className={style.formPane} aria-hidden={!isSignup}>
              <Register />
              
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
