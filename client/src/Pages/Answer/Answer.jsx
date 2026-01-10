import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../Api/axiosConfig";
import styles from "./answer.module.css";

function Answer() {
  // How React knows WHICH question to load
  const { question_id } = useParams();
  //   console.log("Question ID from URL:", question_id);

  // for use of redirecting
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [summary, setSummary] = useState("");
  const [summaryExpanded, setSummaryExpanded] = useState(false);
  const [answerText, setAnswerText] = useState("");

  const [questionLoading, setQuestionLoading] = useState(true);
  const [answersLoading, setAnswersLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login", { state: { from: "/ans" } });
    }
  }, [token, navigate]);

  //    // Fetch question, answers, and AI summary
  useEffect(() => {
    const fetchData = async () => {
      try {
        setQuestionLoading(true);
        setAnswersLoading(true);
        setSummaryLoading(true);

        const [questionRes, answersRes, summaryRes] = await Promise.all([
          axios.get(`/question/${question_id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`/answer/${question_id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`/answer/${question_id}/summary`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setQuestion(questionRes.data.question);
        setAnswers(answersRes.data.answers.reverse());
        setSummary(summaryRes.data.summary);
      } catch (err) {
        setError("Failed to load data.");
      } finally {
        setQuestionLoading(false);
        setAnswersLoading(false);
        setSummaryLoading(false);
      }
    };

    fetchData();
  }, [question_id, token]);

  //   2. Submit/post answer
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!answerText.trim()) {
      setError("Please provide an answer.");
      return;
    }

    try {
      setPosting(true);
      await axios.post(
        "/answer",
        {
          question_id: Number(question_id),
          answer: answerText.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh answers
      const responses = await axios.get(`/answer/${question_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      //   console.log("Answers response:", Answers.data);

      setAnswers(responses.data.answers.reverse());
      setAnswerText("");
      setError(null);

      // message success
      setSuccess("Answer posted successfully ✅");

      // set timeout
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to post answer. Please try again.");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className={styles.container}>
      {question && (
        <div className={styles.question_summary_wrapper}>
          {/* Question */}
          <div className={styles.question_section}>
            <h3 className={styles.big_title}>QUESTION</h3>
            <h2 className={styles.question}>
              <span className={styles.arrow}>➤</span>
              <span className={styles.text}>{question.title}</span>
            </h2>
            <p className={styles.description}>{question.description}</p>
          </div>

          {/* Summary */}
          {summary && (
            <div className={styles.summary_section}>
              <h3>Answer Summary</h3>
              <p
                className={`${styles.summaryText} ${
                  summaryExpanded ? styles.expanded : styles.collapsed
                }`}
              >
                {summary}
              </p>

              <span
                className={styles.readMore}
                onClick={() => setSummaryExpanded(!summaryExpanded)}
              >
                {summaryExpanded ? "Show less" : "Read more..."}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Answers List */}
      <div className={styles.answers_section}>
        <h3 className={styles.big_title}>Answer From The Community</h3>
        {answersLoading && <p>Loading answers...</p>}

        {error && <p className={styles.error}>{error}</p>}

        {!answersLoading && answers.length === 0 && (
          <p>No answers yet. Be the first!</p>
        )}

        {answers.map((ans) => (
          <div key={ans.answer_id} className={styles.answer_card}>
            <div className={styles.user_info}>
              <div className={styles.avatar}>👤</div>
              <span>{ans.user_name}</span>
            </div>
            <p className={styles.content}>{ans.content}</p>
          </div>
        ))}
      </div>
      {success && <p className={styles.success}>{success}</p>}

      {/* Answer Form */}
      <form onSubmit={handleSubmit} className={styles.answer_form}>
        <textarea
          placeholder="Your answer ..."
          rows={6}
          value={answerText}
          onChange={(e) => {
            setAnswerText(e.target.value);
            if (error) setError(null);
          }}
          disabled={posting}
        />
        <button type="submit" disabled={posting}>
          {posting ? "Posting..." : "Post Answer"}
        </button>
      </form>
    </div>
  );
}

export default Answer;
