import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../Api/axiosConfig";
import classes from "./editQuestion.module.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditQuestion = () => {
  const { id } = useParams(); // get question ID from URL
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch the question details
  useEffect(() => {
    const fetchQuestion = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/question/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTitle(data?.question?.title || "");
        setDescription(data?.question?.description || "");
      } catch (err) {
        console.error("Error fetching question:", err);
        setErrorMessage("Failed to load question");
        setTimeout(() => setErrorMessage(""), 3000);
      }
    };

    fetchQuestion();
  }, [id, token]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `/question/${id}`,
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      //   setSuccessMessage("Question updated successfully!");
      toast.success("Question updated Successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/"); // Redirect to home
      }, 2000);
    } catch (err) {
      console.error("Error updating question:", err);
      setErrorMessage("Failed to update question");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  return (
    <div className={classes["edit-container"]}>
      <h2 className={classes["header"]}>Edit Question</h2>

      {successMessage && (
        <div className={classes["success-message"]}>{successMessage}</div>
      )}
      {errorMessage && (
        <div className={classes["error-message"]}>{errorMessage}</div>
      )}

      <form className={classes["edit-form"]} onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter question title"
          required
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter question description"
          rows={6}
          required
        />

        {/* <button type="submit" className={classes["submit-btn"]}>
          Update Question
        </button> */}

        <button type="submit" disabled={loading}>
          {loading ? "updating..." : "Update question"}
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className={classes.cancel}
          disabled={loading}
        >
         Back to home
        </button>
      </form>
    </div>
  );
};

export default EditQuestion;
