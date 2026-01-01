import React from 'react'
import { useParams, Navigate } from "react-router-dom";
import style from './Landing.module.css'

function Landing() {

      const { mode } = useParams();

  if (mode !== "signin" && mode !== "signup") {
    return <Navigate to="/auth/signin" replace />;
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
              {/* <SignIn /> */}
            </div>
            <div className={style.formPane} aria-hidden={!isSignup}>
              {/* <SignUp /> */}
            </div>
          </div>
        </div>
        <div className={style.about}>
          {/* <About /> */}
        </div>
      </div>
    </section>
  );
}

export default Landing