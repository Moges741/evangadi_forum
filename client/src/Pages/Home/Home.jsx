import React, {
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";

import { AppState } from "../../App";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../Api/axiosConfig";
import classes from "./home.module.css";
import { MdEdit, MdDelete } from "react-icons/md";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../../Data/data";

const Home = () => {
  const { user } = useContext(AppState);
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [sortedQuestions, setSortedQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(""); // Debounced for performance
  const [sortOption, setSortOption] = useState("Most Recent");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fetchError, setFetchError] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Fetch questions from backend API (memoized)
  const fetchData = useCallback(async () => {
    if (!token) {
      setFetchError("No authentication token found. Please log in.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setFetchError("");
    try {
      const { data } = await axios.get("/question", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedQuestions = data?.questions || data || []; // Fallback if direct array
      setQuestions(fetchedQuestions);
      setSortedQuestions(fetchedQuestions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      console.error("Error response:", error.response); // Debug log
      if (error.response?.status === 401) {
        localStorage.removeItem("token"); // Clear invalid token
        navigate("/login");
        return;
      }
      setFetchError("Failed to fetch questions. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Debounce search input to reduce re-filters (300ms delay)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ===================== SORTING =====================
  // Re-sort questions whenever `questions` or `sortOption` changes
  useEffect(() => {
    let sortedData = [...questions];
    switch (sortOption) {
      case "Most Recent":
        sortedData.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        break;
      case "By Questions":
        sortedData.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "By Tag":
        sortedData.sort((a, b) => {
          const tagA = (a.tag || "").toLowerCase();
          const tagB = (b.tag || "").toLowerCase();
          return tagA.localeCompare(tagB);
        });
        break;
      default:
        break;
    }
    setSortedQuestions(sortedData);
  }, [questions, sortOption]);

  // ===================== SEARCH FILTER =====================
  // Filter questions by title or username (uses debounced query)
  const filteredQuestions = useMemo(() => {
    return sortedQuestions.filter((q) => {
      const searchText = debouncedSearchQuery.toLowerCase();
      return (
        q.title.toLowerCase().includes(searchText) ||
        q.username.toLowerCase().includes(searchText)
      );
    });
  }, [sortedQuestions, debouncedSearchQuery]);

  // ===================== DELETE LOGIC =====================
  // Open delete confirmation dialog
  const handleDelete = (id) => setConfirmDeleteId(id);

  // Confirm deletion of question (optimistic: remove first, rollback on error)
  const handleConfirmDelete = async () => {
    const deletedId = confirmDeleteId;
    // Optimistic update
    setQuestions((prev) => prev.filter((q) => q.questionid !== deletedId));
    try {
      await axios.delete(`/question/${deletedId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // setSuccessMessage("");
      toast.success("Question deleted successfully!");
    } catch (error) {
      // Rollback on error
      fetchData(); // Refetch to restore
      setErrorMessage("Error deleting question");
      console.error("Delete error:", error);
    } finally {
      setConfirmDeleteId(null);
      // Auto-clear messages
      setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 3000);
    }
  };

  // ===================== UI =====================
  return (
    <section>
      <div className={classes["main-container"]}>
        {/* Header section with Ask Question button and Welcome message */}
        <div className={classes["welcome-section"]}>
          <Link to="/askquestion" className={classes["ask-question-btn"]}>
            Ask Question
          </Link>
          <div className={classes["welcome-message"]}>
            Welcome:{" "}
            <span className={classes["username"]}>
              {user?.username.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Search input */}
        <div className={classes["search-bar"]}>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={classes["search-input"]}
            placeholder="Search questions..."
            type="search" // Semantic input type
            aria-label="Search questions by title or username"
          />
        </div>

        {/* Sorting dropdown */}
        <div className={classes["sort-dropdown"]}>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className={classes["sort-select"]}
            aria-label="Sort questions by"
          >
            <option value="Most Recent">Most Recent</option>
            <option value="By Questions">By Questions</option>
            <option value="By Tag">By Tag</option>
          </select>
        </div>

        {/* Fetch Error with Retry */}
        {fetchError && (
          <div className={classes["error-message"]}>
            {fetchError}{" "}
            <button
              type="button"
              onClick={fetchData}
              className={classes["retry-btn"]}
            >
              Retry
            </button>
          </div>
        )}

        {/* Alerts */}
        {successMessage && (
          <div className={classes["success-message"]}>{successMessage}</div>
        )}
        {errorMessage && (
          <div className={classes["error-message"]}>{errorMessage}</div>
        )}

        {/* Delete confirmation prompt */}
        {confirmDeleteId !== null && (
          <div className={classes["confirmation_overlay"]}>
            <div
              className={classes["confirmation-prompt"]}
              role="dialog"
              aria-modal="true"
              aria-labelledby="confirm-delete-label"
            >
              <p id="confirm-delete-label">
                Are you sure you want to delete this question?
              </p>
              <button
                type="button"
                className={`${classes["confirmation-btn"]} ${classes["confirmation-btn-danger"]}`}
                onClick={handleConfirmDelete}
              >
                Yes, Delete
              </button>
              <button
                type="button"
                className={`${classes["confirmation-btn"]} ${classes["confirmation-btn-secondary"]}`}
                onClick={() => setConfirmDeleteId(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Questions list */}
        {loading ? (
          <p>Loading questions...</p>
        ) : filteredQuestions.length > 0 ? (
          filteredQuestions.map((q) => (
            <div className={classes["questions-list"]} key={q.questionid}>
              <div className={classes["question-item"]}>
                {/* Link to answer page */}
                <Link
                  to={`/answer/${q.questionid}`}
                  className={classes["question-link"]}
                >
                  <div className={classes["user-info"]}>
                    {/* User avatar + username */}
                    <div className={classes["user"]}>
                      {user?.userid === q.userid && user?.profile_picture ? (
                        <img
                          src={`${API_BASE_URL}${user.profile_picture}`}
                          alt="Profile"
                          className={classes.profile_image}
                        />
                      ) : (
                        <div className={classes.avatar}>
                          {q?.firstname[0].toUpperCase()}
                          {q?.lastname[0].toUpperCase()}
                        </div>
                      )}

                      <p>{q.username}</p>
                    </div>
                    {/* Question title */}
                    <div className={classes["question-text"]}>{q.title}</div>
                  </div>
                  {/* Tag and Date/Time - Right Side */}
                  <div className={classes["timestamp-container"]}>
                    {/* Question Tag - Top */}
                    <div className={classes["question-tag"]}>
                      {q.tag || "General"}
                    </div>

                    {/* Date and Time - Bottom */}
                    <span className={classes["timestamp"]}>
                      {new Date(q.created_at).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      at{" "}
                      {new Date(q.created_at).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </div>

                  {/* Edit/Delete Actions - Right Side */}
                  {user?.username === q.username && (
                    <div
                      className={classes["action-icons"]}
                      onClick={(e) => e.preventDefault()}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          navigate(`/edit-question/${q.questionid}`);
                        }}
                        className={classes["icon-btn"]}
                        aria-label="Edit question"
                      >
                        <MdEdit size={20} color="blue" title="Edit" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDelete(q.questionid);
                        }}
                        className={classes["icon-btn"]}
                        aria-label="Delete question"
                      >
                        <MdDelete size={20} color="red" title="Delete" />
                      </button>
                    </div>
                  )}

                  {/* Right Arrow */}
                  <div className={classes["arrow-container"]}>
                    <ChevronRightIcon className={classes["arrow"]} />
                  </div>
                </Link>

                {/* Empty actions container for consistent spacing */}
                <div className={classes["info-and-actions"]}></div>
              </div>
            </div>
          ))
        ) : (
          <p>No questions found. Be the first to ask!</p>
        )}
      </div>
    </section>
  );
};

export default Home;
