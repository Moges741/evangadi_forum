import React, { useState, useEffect } from "react";
import styles from "./ask.module.css";
import axios from "../../Api/axiosConfig.js";
import KeywordExtractor from "keyword-extractor";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Askquestion() {
  const token = localStorage.getItem("token");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tag, setTag] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const [stepsCollapsed, setStepsCollapsed] = useState(true);

  // Check authentication on component mount
  useEffect(() => {
    if (!token) {
      navigate("/login", { state: { from: "/ask" } });
    }
  }, [token, navigate]);
  // Toggle steps function - MOVED OUTSIDE generateTag
  const toggleSteps = () => {
    setStepsCollapsed(!stepsCollapsed);
  };
  // Generate tag from title whenever title changes
  useEffect(() => {
    if (title.trim().length > 3) {
      const generatedTag = generateTag(title);
      setTag(generatedTag);
    } else {
      setTag("");
    }
  }, [title]);

  // Function to generate tags using keyword-extractor
  const generateTag = (title) => {
    try {
      const extractionResult = KeywordExtractor.extract(title, {
        language: "english",
        remove_digits: true,
        return_changed_case: true,
        remove_duplicates: true,
      });

      // Filter out very short keywords and use the most relevant one
      const validKeywords = extractionResult.filter(
        (keyword) => keyword.length > 2
      );

      return validKeywords.length > 0
        ? validKeywords[0].toLowerCase()
        : "general";
    } catch (error) {
      console.error("Error generating tag:", error);
      return "general";
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

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setFormErrors({});

    if (!validateForm()) return;
    if (tag && tag.length > 20) {
      setFormErrors((prev) => ({
        ...prev,
        tag: "Tag must be less than 20 characters",
      }));
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
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setQuestions((prev) => [
        {
          questionId: response.data.questionId,
          title,
          description,
          tag,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);

      toast.success("Question Posted Successfully!");
      setTitle("");
      setDescription("");
      setTag("");
      //  navigate(`/question/${response.data.questionId}`);
      navigate("/");
    } catch (error) {
      console.error("Error posting question:", error);
      if (error.response) {
        if (error.response.status === 401) {
          setError("Your session has expired. Please login again.");
          localStorage.removeItem("token");
          navigate("/login");
        } else if (error.response.status === 400) {
          setError("Invalid input. Please check your question and try again.");
        } else if (error.response.status === 429) {
          setError(
            "Too many requests. Please wait a moment before trying again."
          );
        } else {
          setError(
            error.response.data?.message ||
              "Failed to post question. Please try again."
          );
        }
      } else if (error.request) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  // Handle input changes with debounced validation
  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);

    // Clear title error when user starts typing
    if (formErrors.title && value.trim().length >= 10) {
      setFormErrors((prev) => ({ ...prev, title: "" }));
    }
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value);

    // Clear description error when user starts typing
    if (formErrors.description && value.trim().length >= 20) {
      setFormErrors((prev) => ({ ...prev, description: "" }));
    }
  };

  return (
    <div className={styles.container}>
      <div
        className={`${styles.steps_toFollow} ${
          stepsCollapsed ? styles.collapsed : ""
        }`}
        onClick={toggleSteps}
      >
        <h2>Steps for writing a good question</h2>
        <ul>
          <li>Summarize your question in a one-line title.</li>
          <li>Describe your problem in more detail.</li>
          <li>Describe what you tried and what you expected to happen.</li>
          <li>Review your question and post it to the site.</li>
        </ul>
      </div>

      <div className={styles.question_form}>
        <div className={styles.question_title}>
          <h2>Post your Question</h2>
        </div>

        {error && (
          <div className={styles.error_message}>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.form_group}>
            {/* <label htmlFor="title">Title</label> */}
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

          <div className={styles.form_group}>
            {/* <label htmlFor="description">Description</label> */}
            <textarea
              id="description"
              placeholder="Question detail..."
              value={description}
              onChange={handleDescriptionChange}
              className={formErrors.description ? styles.error_input : ""}
              disabled={loading}
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

          <div className={styles.form_actions}>
            <button
              type="submit"
              disabled={loading}
              className={loading ? styles.loading_button : ""}
            >
              {loading ? "Posting..." : "Post "}
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

        {questions.length > 0 && (
          <div className={styles.recent_questions}>
            <h3>Your Recently Posted Questions</h3>
            {questions.map((question) => (
              <div key={question.questionId} className={styles.question_card}>
                <h4>{question.title}</h4>
                <p className={styles.question_excerpt}>
                  {question.description.length > 150
                    ? `${question.description.substring(0, 150)}...`
                    : question.description}
                </p>
                <div className={styles.question_meta}>
                  <span className={styles.tag}>{question.tag}</span>
                  <span className={styles.date}>
                    {new Date(question.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Askquestion;
