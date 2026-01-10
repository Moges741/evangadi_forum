import React, { useState, useEffect } from "react";
import styles from "./ask.module.css";
import axios from "../../Api/axiosConfig.js";
import KeywordExtractor from "keyword-extractor";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Askquestion = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // ===================== STATE =====================
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [stepsCollapsed, setStepsCollapsed] = useState(true);

  // ===================== AUTH CHECK =====================
  useEffect(() => {
    if (!token) {
      navigate("/login", { state: { from: "/askquestion" } });
    }
  }, [token, navigate]);

  // ===================== TOGGLE STEPS =====================
  const toggleSteps = () => {
    setStepsCollapsed(!stepsCollapsed);
  };

  // ===================== AUTO-GENERATE TAG =====================
  useEffect(() => {
    if (title.trim().length > 3) {
      const generatedTag = generateTag(title);
      setTag(generatedTag);
    } else {
      setTag("");
    }
  }, [title]);

  const generateTag = (title) => {
    try {
      const extractionResult = KeywordExtractor.extract(title, {
        language: "english",
        remove_digits: true,
        return_changed_case: true,
        remove_duplicates: true,
      });

      const validKeywords = extractionResult.filter((k) => k.length > 2);

      return validKeywords.length > 0
        ? validKeywords[0].toLowerCase()
        : "general";
    } catch (err) {
      console.error("Error generating tag:", err);
      return "general";
    }
  };

  // ===================== VALIDATION =====================
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

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ===================== SUBMIT FORM =====================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setFormErrors({});

    if (!validateForm()) return;
    if (tag && tag.length > 20) {
      setFormErrors({ tag: "Tag must be less than 20 characters" });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "/question",
        {
          title: title.trim(),
          description: description.trim(),
          tag: tag || "general",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // setSuccessMessage("Question posted successfully!");
        toast.success("Question Posted Successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        setTitle("");
        setDescription("");
        setTag("");
        navigate("/"); // Redirect to Home
      }, 2000);
    } catch (err) {
      console.error("Error posting question:", err);

      if (err.response) {
        switch (err.response.status) {
          case 401:
            setError("Your session has expired. Please login again.");
            localStorage.removeItem("token");
            navigate("/login");
            break;
          case 400:
            setError(
              "Invalid input. Please check your question and try again."
            );
            break;
          case 429:
            setError("Too many requests. Please wait a moment and try again.");
            break;
          default:
            setError(err.response.data?.message || "Failed to post question.");
        }
      } else if (err.request) {
        setError("Network error. Check your connection and try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ===================== INPUT HANDLERS =====================
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (formErrors.title && e.target.value.trim().length >= 10) {
      setFormErrors((prev) => ({ ...prev, title: "" }));
    }
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    if (formErrors.description && e.target.value.trim().length >= 20) {
      setFormErrors((prev) => ({ ...prev, description: "" }));
    }
  };

  // ===================== JSX =====================
  return (
    <div className={styles.container}>
      <div
        className={`${styles.steps_toFollow} ${
          stepsCollapsed ? styles.collapsed : ""
        }`}
        onClick={toggleSteps}
      >
        <h2>Steps for Writing a Good Question</h2>
        <ul>
          <li>Summarize your question in a one-line title.</li>
          <li>Describe your problem in more detail.</li>
          <li>Describe what you tried and what you expected to happen.</li>
          <li>Review your question and post it to the site.</li>
        </ul>
      </div>

      <div className={styles.question_form}>
        <h2>Post Your Question</h2>

        {error && <div className={styles.error_message}>{error}</div>}
        {successMessage && (
          <div className={styles.success_message}>{successMessage}</div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className={styles.form_group}>
            <input
              id="title"
              type="text"
              placeholder="Question Title"
              value={title}
              onChange={handleTitleChange}
              className={formErrors.title ? styles.error_input : ""}
              disabled={loading}
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

          {/* Description */}
          <div className={styles.form_group}>
            <textarea
              id="description"
              placeholder="Question detail..."
              value={description}
              onChange={handleDescriptionChange}
              className={formErrors.description ? styles.error_input : ""}
              disabled={loading}
              rows={10}
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

          {/* Tag */}
          <div className={styles.form_group}>
            <label htmlFor="tag">Suggested Tag</label>
            <input
              id="tag"
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className={styles.tag_input}
              disabled={loading}
            />
            <div className={styles.input_help}>
              This tag is auto-generated from your title. You can edit it if
              needed.
            </div>
          </div>

          {/* Actions */}
          <div className={styles.form_actions}>
            <button
              type="submit"
              disabled={loading}
              className={loading ? styles.loading_button : ""}
            >
              {loading ? "Posting..." : "Post"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={loading}
              className={styles.cancel_button}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Askquestion;
