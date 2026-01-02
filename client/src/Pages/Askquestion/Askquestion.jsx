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

  // redirect to login if not authenticated
  useEffect(() => {
    if (!token || !user) {
      navigate("/login");
    }
  }, [token, user, navigate]);

  // handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // validate that required fields are filled
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!description.trim()) {
      setError("Description is required");
      return;
    }

    if (title.length > 200) {
      setError("Title cannot exceed 200 characters");
      return;
    }

    if (tag && tag.length > 20) {
      setError("Tag cannot exceed 20 characters");
      return;
    }

    if (!token) {
      setError("You must be logged in to post a question");
      navigate("/login");
      return;
    }
    // set loading state to prevent multiple submissions
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "/question/",
        {
          title: title.trim(),
          description: description.trim(),
          tag: tag.trim() || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // show success message
      setSuccess(response.data.message || "Question posted successfully");

      // reset form fields
      setTitle("");
      setDescription("");
      setTag("");


      // redirect to question detail page after  1.5 secconds
      setTimeout(() => {
        navigate(`/question/${response.data.questionId}`);
      }, 1500);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.msg ||
        "Failed to post question, please try again.";

        setError(errorMessage);
        console.log("error postting question:", error);
    }
    finally{
      setIsSubmitting(false);
    }
  };

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
