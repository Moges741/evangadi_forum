import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { questionAPI } from "../services/api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Questions.css";

const Questions = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await questionAPI.getAll();
      setQuestions(data.questions || []);
    } catch (err) {
      setError(err.message || "Failed to load questions");
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionClick = (questionId) => {
    navigate(`/question/${questionId}`);
  };

  return (
    <div className="questions-page">
      <Header user={user} onLogout={onLogout} />
      <div className="questions-container">
        <div className="questions-content">
          <button
            className="btn-ask-question"
            onClick={() => navigate("/ask-question")}
          >
            Ask Question
          </button>
          <h1 className="questions-title">Questions</h1>
          {loading ? (
            <div className="loading">Loading questions...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : questions.length === 0 ? (
            <div className="no-questions">
              <p>No questions yet. Be the first to ask!</p>
              <button
                className="btn-ask-question"
                onClick={() => navigate("/ask-question")}
              >
                Ask a Question
              </button>
            </div>
          ) : (
            <div className="questions-list">
              {questions.map((question) => (
                <div
                  key={question.question_id}
                  className="question-item"
                  onClick={() => handleQuestionClick(question.question_id)}
                >
                  <div className="question-avatar">
                    <div className="avatar-circle">
                      {question.user_name
                        ? question.user_name.charAt(0).toUpperCase()
                        : "U"}
                    </div>
                    <div className="question-username">
                      {question.user_name || "Anonymous"}
                    </div>
                  </div>
                  <div className="question-text">{question.title}</div>
                  <div className="question-arrow">›</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Questions;
