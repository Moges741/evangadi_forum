import React from "react";
import { useNavigate } from "react-router-dom";
import classes from "./about.module.css";
import { Link } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <section className={classes.container}>
      <div className={classes.content}>
        <p className={classes.label}>About</p>

        <h1 className={classes.heading}>Evangadi Networks</h1>

        <p className={classes.text}>
          No matter what stage of life you are in, whether you’re just starting
          elementary school or being promoted to CEO of a Fortune 500 company,
          you have much to offer to those who are trying to follow in your
          footsteps.
        </p>

        <p className={classes.text}>
          Whether you are willing to share your knowledge or you are just
          looking to meet mentors of your own, please start by joining the
          network here.
        </p>

        <Link to="/howitworks">
          <button className={classes.button}>HOW IT WORKS</button>
        </Link>
      </div>
    </section>
  );
};

export default About;
