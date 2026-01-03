import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { questionAPI, answerAPI } from "../services/api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/QuestionDetail.css";

const QuestionDetail = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const { questionId } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [answerText, setAnswerText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchQuestion = useCallback(async () => {
    try {
      const data = await questionAPI.getById(questionId);
      setQuestion(data.question);
    } catch (err) {
      setError(err.message || "Failed to load question");
    } finally {
      setLoading(false);
    }
  }, [questionId]);

  const fetchAnswers = useCallback(async () => {
    try {
      const data = await answerAPI.getByQuestionId(questionId);
      setAnswers(data.answers || []);
    } catch (err) {
      console.error("Failed to load answers:", err);
      setAnswers([]);
    }
  }, [questionId]);

  useEffect(() => {
    fetchQuestion();
    fetchAnswers();
  }, [questionId, fetchQuestion, fetchAnswers]);

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!answerText.trim()) {
      setError("Please enter an answer");
      return;
    }

    if (!user) {
      setError("Please login to post an answer");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      await answerAPI.create(parseInt(questionId), answerText);
      setAnswerText("");
      fetchAnswers();
    } catch (err) {
      setError(err.message || "Failed to post answer");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="question-detail-page">
        <Header user={user} onLogout={onLogout} />
        <div className="loading">Loading question...</div>
        <Footer />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="question-detail-page">
        <Header user={user} onLogout={onLogout} />
        <div className="error">Question not found</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="question-detail-page">
      <Header user={user} onLogout={onLogout} />
      <div className="question-detail-container">
        <div className="question-detail-content">
          <div className="question-section">
            <h2 className="section-title">Question</h2>
            <h1 className="question-title">{question.title}</h1>
            <p className="question-description">{question.content}</p>
            <div className="divider"></div>
          </div>

          <div className="answers-section">
            <h2 className="section-title">Answer From The Community</h2>
            {answers.length === 0 ? (
              <div className="no-answers">
                No answers yet. Be the first to answer!
              </div>
            ) : (
              <div className="answers-list">
                {answers.map((answer) => (
                  <div key={answer.answer_id} className="answer-item">
                    <div className="answer-avatar">
                      <div className="avatar-circle">
                        {answer.user_name
                          ? answer.user_name.charAt(0).toUpperCase()
                          : "U"}
                      </div>
                      <div className="answer-username">
                        {answer.user_name || "Anonymous"}
                      </div>
                    </div>
                    <div className="answer-content">{answer.content}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="answer-form-section">
            <h2 className="section-title">Answer The Top Question</h2>
            <button className="link-button" onClick={() => navigate("/")}>
              Go to Question page
            </button>
            <form onSubmit={handleSubmitAnswer} className="answer-form">
              <textarea
                className="answer-textarea"
                placeholder="Your Answer..."
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                rows="6"
                required
              />
              {error && <div className="error-message">{error}</div>}
              <button
                type="submit"
                className="btn-post-answer"
                disabled={submitting}
              >
                {submitting ? "Posting..." : "Post Your Answer"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default QuestionDetail;
