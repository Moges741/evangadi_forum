import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../Api/axiosConfig.js";
import { toast } from "react-toastify";
import styles from "./editQuestion.module.css";

function EditQuestion() {
  const { questionid } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Fetch question data on component mount
  useEffect(() => {
    if (!token) {
      navigate("/signin");
      return;
    }
    fetchQuestion();
  }, [questionid, token, navigate]);

  const fetchQuestion = async () => {
    try {
      const { data } = await axios.get(`/question/${questionid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const question = data.question;
      setTitle(question.title);
      setDescription(question.description);
      setTag(question.tag || "");
      setLoading(false);
    } catch (error) {
      console.error("Error fetching question:", error);
      setError("Failed to load question. Please try again.");
      setLoading(false);
    }
  };

  // Validate form inputs
  const validateForm = () => {
    const errors = {};

    if (!title.trim()) {
      errors.title = "Title is required";
    } else if (title.trim().length < 10) {
      errors.title = "Title must be at least 10 characters long";
    } else if (title.trim().length > 200) {
      errors.title = "Title cannot exceed 200 characters";
    }

    if (!description.trim()) {
      errors.description = "Description is required";
    } else if (description.trim().length < 20) {
      errors.description = "Description must be at least 20 characters long";
    } else if (description.trim().length > 2000) {
      errors.description = "Description cannot exceed 2000 characters";
    }

    if (tag && tag.length > 20) {
      errors.tag = "Tag must be less than 20 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setFormErrors({});

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      await axios.put(
        `/question/${questionid}`,
        {
          title: title.trim(),
          description: description.trim(),
          tag: tag.trim() || "general",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Question updated successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error updating question:", error);
      if (error.response?.status === 401) {
        setError("Your session has expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/signin");
      } else if (error.response?.status === 403) {
        setError("You don't have permission to edit this question.");
      } else {
        setError(
          error.response?.data?.message ||
            "Failed to update question. Please try again."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading question...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.question_form}>
        <div className={styles.question_title}>
          <h2>Edit Your Question</h2>
        </div>

        {error && (
          <div className={styles.error_message}>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.form_group}>
            <h4>Titile</h4>
            <input
              id="title"
              type="text"
              placeholder="Question Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={formErrors.title ? styles.error_input : ""}
              disabled={submitting}
            />
            {formErrors.title && (
              <span className={styles.error_text}>{formErrors.title}</span>
            )}
            <div className={styles.input_help}>
              {title.length > 0 && (
                <span className={title.length < 10 ? styles.warning : ""}>
                  {title.length}/200 characters
                </span>
              )}
            </div>
          </div>

          <div className={styles.form_group}>
            <h4>Description</h4>
            <textarea
              id="description"
              placeholder="Question detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={formErrors.description ? styles.error_input : ""}
              disabled={submitting}
              rows="10"
            />
            {formErrors.description && (
              <span className={styles.error_text}>
                {formErrors.description}
              </span>
            )}
            <div className={styles.input_help}>
              {description.length > 0 && (
                <span className={description.length < 20 ? styles.warning : ""}>
                  {description.length}/2000 characters
                </span>
              )}
            </div>
          </div>

          <div className={styles.form_group}>
            <label htmlFor="tag">Tag</label>
            <input
              id="tag"
              type="text"
              placeholder="Enter a tag (optional)"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className={styles.tag_input}
              disabled={submitting}
            />
            {formErrors.tag && (
              <span className={styles.error_text}>{formErrors.tag}</span>
            )}
          </div>

          <div className={styles.form_actions}>
            <button
              type="submit"
              disabled={submitting}
              className={submitting ? styles.loading_button : ""}
            >
              {submitting ? "Updating..." : "Update Question"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={submitting}
              className={styles.cancel_button}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditQuestion;
