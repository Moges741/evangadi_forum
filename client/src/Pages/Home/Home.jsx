// // ===================== Desalegn Tsega — Implement Home Page Start =====================
// React core hooks
import React, { useContext, useEffect, useState } from "react";

// Global app context
import { AppState } from "../../App";

// Routing utilities
import { Link, useNavigate } from "react-router-dom";

// Axios instance
import axios from "../../Api/axiosConfig";

// CSS module
import classes from "./home.module.css";

// Icons
import { MdEdit, MdDelete } from "react-icons/md";
import { IoIosContact } from "react-icons/io";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  // Get logged-in user from global state
  const { user } = useContext(AppState);
  // Navigation hook
  const navigate = useNavigate();
  // ===================== STATE =====================
  const [questions, setQuestions] = useState([]); // All questions from API
  const [sortedQuestions, setSortedQuestions] = useState([]); // Sorted questions
  const [searchQuery, setSearchQuery] = useState(""); // Search input
  const [sortOption, setSortOption] = useState("Most Recent"); // Sorting option
  const [successMessage, setSuccessMessage] = useState(""); // Success alert
  const [errorMessage, setErrorMessage] = useState(""); // Error alert
  const [confirmDeleteId, setConfirmDeleteId] = useState(null); // Delete confirmation ID

  // Auth token
  const token = localStorage.getItem("token");

  // ===================== FETCH DATA =====================
  // Fetch all questions from backend
  const fetchData = async () => {
    try {
      const { data } = await axios.get("/question", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(data);

      // Save questions to state
      setQuestions(data?.questions || []);
      setSortedQuestions(data?.questions || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  // Fetch questions on component mount
  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  // ===================== SORTING =====================
  // Re-sort whenever questions or sort option changes
  useEffect(() => {
    let sortedData = [...questions];

    switch (sortOption) {
      case "Most Recent":
        sortedData.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        break;

      case "Most Popular":
        sortedData.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;

      case "By Questions":
        sortedData.sort((a, b) => a.title.localeCompare(b.title));
        break;

      case "By Date":
        sortedData.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
        break;

      default:
        break;
    }

    setSortedQuestions(sortedData);
  }, [questions, sortOption]);

  // ===================== SEARCH FILTER =====================
  // Filter by question title OR username
  const filteredQuestions = sortedQuestions.filter((q) => {
    const searchText = searchQuery.toLowerCase();
    return (
      q.title.toLowerCase().includes(searchText) ||
      q.username.toLowerCase().includes(searchText)
    );
  });

  // ===================== DELETE LOGIC =====================
  // Open delete confirmation dialog
  const handleDelete = (id) => setConfirmDeleteId(id);

  // Confirm deletion
  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`/question/${confirmDeleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove deleted question from state
      setQuestions((prev) =>
        prev.filter((q) => q.questionid !== confirmDeleteId)
      );

      // Show success message
      // setSuccessMessage("Question deleted successfully");
      toast.success("Question Deleted Successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      // Show error message
      console.error("Delete failed:", error);
      setErrorMessage("Failed to delete question");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      // Close confirmation dialog
      setConfirmDeleteId(null);
    }
  };

  // ===================== EDIT NAVIGATION =====================
  const handleEdit = (id) => {
    navigate(`/edit-question/${id}`);
  };

  // ===================== UI =====================
  return (
    <section>
      <div className={classes["main-container"]}>
        {/* Header section */}
        <div className={classes["welcome-section"]}>
          <Link to="/askquestion" className={classes["ask-question-btn"]}>
            {"Ask Question"}
          </Link>

          <div className={classes["welcome-message"]}>
            {"welcome"} :
            <span className={classes["username"]}> {user?.username}</span>
          </div>
        </div>

        {/* Search input */}
        <div className={classes["search-bar"]}>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={classes["search-input"]}
            placeholder={"search"}
          />
        </div>

        {/* Sorting dropdown */}
        <div className={classes["sort-dropdown"]}>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className={classes["sort-select"]}
          >
            <option value="Most Recent">Most Recent</option>
            <option value="Most Popular">Most Popular</option>
            <option value="By Questions">By Question</option>
            <option value="By Date">By Date</option>
          </select>
        </div>

        {/* Alerts */}
        {successMessage && (
          <div className={classes["success-message"]}>{successMessage}</div>
        )}
        {errorMessage && (
          <div className={classes["error-message"]}>{errorMessage}</div>
        )}

        {/* Delete confirmation */}
        {confirmDeleteId && (
          <div className={classes["confirmation-prompt"]}>
            <p>Are you sure you want to delete this question?</p>
            <button className="btn btn-danger" onClick={handleConfirmDelete}>
              Yes
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setConfirmDeleteId(null)}
            >
              Cancel
            </button>
          </div>
        )}

        {/* Questions list */}
        {/* Questions List */}
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((q) => (
            <div className={classes["questions-list"]} key={q.questionid}>
              <div className={classes["question-item"]}>
                <Link
                  to={`/answer/${q.questionid}`}
                  className={classes["question-link"]}
                >
                  <div className={classes["user-info"]}>
                    <div className={classes["user"]}>
                      <IoIosContact size={50} />
                      <p>{q?.username}</p>
                    </div>
                    <div className={classes["question-text"]}>{q?.title}</div>
                  </div>
                </Link>

                {/* Owner actions */}
                <div className={classes["info-and-actions"]}>
                  <div className={classes["date-and-actions"]}>
                    <span className={classes["timestamp"]}>
                      {/* {new Date(q.created_at).toLocaleString()} */}
                      {/* {new Date(q.created_at).toLocaleDateString()} */}
                      {new Date(q.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>

                    {user?.username === q?.username && (
                      <div className={classes["action_icons"]}>
                        <MdEdit
                          size={24}
                          title="Edit"
                          color="blue"
                          onClick={() => handleEdit(q.questionid)}
                        />
                        <MdDelete
                          size={24}
                          title="Delete"
                          color="red"
                          onClick={() => handleDelete(q.questionid)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No questions found</p>
        )}
      </div>
    </section>
  );
};

export default Home;
