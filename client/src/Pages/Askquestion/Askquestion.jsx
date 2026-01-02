import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../../Api/axiosConfig";
import { AppState } from "../../App";
import classes from "./ask.module.css";

const Askquestion = () => {
  // context and navigation
  const { user } = useContext(AppState);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  //   states to manage form inputs
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(""); 
  const [tag, setTag] = useState(""); 
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); 

  return (
    <div className={classes.container}>
      {/* This section provides guidance on how to write a good question */}
      <div className={classes.instructionsSection}>
        <h2 className={classes.instructionsTitle}>
          Steps to write a good question
        </h2>
        <ul className={classes.instructionsList}>
          <li>Summarize your problem in a one-line title.</li>
          <li>Describe your problem in more detail.</li>
          <li>Describe what you tried and what you expected to happen.</li>
          <li>Review your question and post it to the site.</li>
        </ul>
      </div>
    </div>
  );
};

export default Askquestion;
