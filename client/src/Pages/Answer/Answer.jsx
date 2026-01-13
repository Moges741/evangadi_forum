import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../Api/axiosConfig";
import styles from "./answer.module.css";
import { toast } from "react-toastify";
import { AppState } from "../../App";
import { MdEdit, MdDelete } from "react-icons/md";
import { IoIosContact } from "react-icons/io";

function Answer() {
  const { question_id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { user } = useContext(AppState);

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [summary, setSummary] = useState(""); 
  const [answerText, setAnswerText] = useState("");
  const [summaryExpanded, setSummaryExpanded] = useState(false);

  const [expandedAnswerId, setExpandedAnswerId] = useState(null);



  const [answersLoading, setAnswersLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [confirmDeleteAnswerId, setConfirmDeleteAnswerId] = useState(null);
  const [error, setError] = useState(null);

  /* ---------------- SUMMARY HELPERS ---------------- */

  const MAX_LENGTH = 100;

  const shouldShowReadMore = () => summary.length > MAX_LENGTH;

  const getSummaryText = () => {
    if (summaryExpanded) return summary;

    return summary.length > MAX_LENGTH
      ? summary.slice(0, MAX_LENGTH) + "..."
      : summary;
  };
  
  const ANSWER_LIMIT = 250;

  const getAnswerText = (text, answerId) => {
    if (expandedAnswerId === answerId) return text;

    return text.length > ANSWER_LIMIT
      ? text.slice(0, ANSWER_LIMIT) + "..."
      : text;
  };

  const shouldShowAnswerReadMore = (text) => {
    return text.length > ANSWER_LIMIT;
  };
  
  
  /* ---------------- AUTH CHECK ---------------- */

  useEffect(() => {
    if (!token) navigate("/login", { state: { from: "/ans" } });
  }, [token, navigate]);

  /* ---------------- FETCH DATA ---------------- */

  useEffect(() => {
    const fetchData = async () => {
      try {
        setAnswersLoading(true);

        const [questionRes, answerRes, summaryRes] = await Promise.all([
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
        setAnswers(answerRes.data.answers.reverse());
        setSummary(summaryRes.data.summary || "");
        setSummaryExpanded(false);
      } catch {
        setError("Failed to load data.");
      } finally {
        setAnswersLoading(false);
      }
    };

    fetchData();
  }, [question_id, token]);

  /* ---------------- POST ANSWER ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answerText.trim()) return setError("Please provide an answer.");

    try {
      setPosting(true);

      await axios.post(
        "/answer",
        { question_id: Number(question_id), answer: answerText.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const res = await axios.get(`/answer/${question_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const summaryRes = await axios.get(`/answer/${question_id}/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAnswers(res.data.answers.reverse());
      setSummary(summaryRes.data.summary || "");
      setSummaryExpanded(false);
      setAnswerText("");
      setError(null);
      toast.success("Answer Posted Successfully!");
    } catch {
      setError("Failed to post answer. Try again.");
    } finally {
      setPosting(false);
    }
  };

  /* ---------------- DELETE ANSWER ---------------- */

  const handleConfirmDeleteAnswer = async () => {
    try {
      await axios.delete(`/answer/${confirmDeleteAnswerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAnswers((prev) =>
        prev.filter((a) => a.answer_id !== confirmDeleteAnswerId)
      );

      const summaryRes = await axios.get(`/answer/${question_id}/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSummary(summaryRes.data.summary || "");

      toast.success("Answer deleted");
    } catch {
      toast.error("Failed to delete answer");
    } finally {
      setConfirmDeleteAnswerId(null);
    }
  };

  /* ---------------- JSX ---------------- */

  return (
    <div className={styles.container}>
      {question && (
        <div className={styles.question_summary_wrapper}>
          {/* QUESTION */}
          <div className={styles.question_section}>
            <h3 className={styles.big_title}>QUESTION</h3>
            <h2 className={styles.question}>
              <span className={styles.arrow}>➤</span>
              <span className={styles.text}>{question.title}</span>
            </h2>
            <p className={styles.description}>{question.description}</p>
          </div>

          {/* SUMMARY */}
          {summary && (
            <div className={styles.summary_section}>
              <h3>Answer Summary</h3>

              <p className={styles.summaryText}>{getSummaryText()}</p>

              {shouldShowReadMore() && (
                <span
                  className={styles.readMore}
                  onClick={() => setSummaryExpanded((prev) => !prev)}
                >
                  {summaryExpanded ? "Show less" : "Read more..."}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* ANSWERS */}
      <div className={styles.answers_section}>
        <h3 className={styles.big_title}>Answers from the Community</h3>

        {answersLoading && <p>Loading answers...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {!answersLoading && answers.length === 0 && <p>No answers yet!</p>}

        {/* {confirmDeleteAnswerId && (
          <div className={styles.confirm_box}>
            <p>Delete this answer?</p>
            <button onClick={handleConfirmDeleteAnswer}>Yes</button>
            <button onClick={() => setConfirmDeleteAnswerId(null)}>
              Cancel
            </button>
          </div>
        )} */}

        {confirmDeleteAnswerId !== null && (
          <div className={styles.confirmation_overlay}>
            <div
              className={styles.confirmation_prompt}
              role="dialog"
              aria-modal="true"
              aria-labelledby="confirm-delete-label"
            >
              <p id="confirm-delete-label">
                Are you sure you want to delete this answer?
              </p>

              <button
                type="button"
                className={`${styles.confirmation_btn} ${styles.confirmation_btn_danger}`}
                onClick={handleConfirmDeleteAnswer}
              >
                Yes, Delete
              </button>

              <button
                type="button"
                className={`${styles.confirmation_btn} ${styles.confirmation_btn_secondary}`}
                onClick={() => setConfirmDeleteAnswerId(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {answers.map((ans) => (
          <div key={ans.answer_id} className={styles.answer_card}>
            <div className={styles.user_info}>
              <div className={styles.avatar}>
                {ans.user_name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
              <span>{ans.user_name}</span>
            </div>

            <div className={styles.content}>
              {getAnswerText(ans.content, ans.answer_id)}

              {shouldShowAnswerReadMore(ans.content) && (
                <span
                  className={styles.readMores}
                  onClick={() =>
                    setExpandedAnswerId(
                      expandedAnswerId === ans.answer_id ? null : ans.answer_id
                    )
                  }
                >
                  {expandedAnswerId === ans.answer_id
                    ? " Show less"
                    : " Read more..."}
                </span>
              )}
            </div>

            <div className={styles.answer_footer}>
              <span className={styles.timestamp}>
                {new Date(ans.created_at).toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}{" "}
                at{" "}
                {new Date(ans.created_at).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </span>

              {user?.userid === ans.userid && (
                <div className={styles.action_icons}>
                  <MdEdit
                    size={22}
                    color="blue"
                    title="Edit"
                    onClick={() => navigate(`/edit-answer/${ans.answer_id}`)}
                  />
                  <MdDelete
                    size={22}
                    color="red"
                    title="Delete"
                    onClick={() => setConfirmDeleteAnswerId(ans.answer_id)}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* POST ANSWER */}
      <form onSubmit={handleSubmit} className={styles.answer_form}>
        <textarea
          placeholder="Your answer..."
          rows={6}
          value={answerText}
          onChange={(e) => {
            setAnswerText(e.target.value);
            if (error) setError(null);
          }}
          disabled={posting}
        />
        <div className={styles.form_actions}>
          <button type="submit" disabled={posting}>
            {posting ? "Posting..." : "Post Answer"}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className={styles.cancel}
            // disabled={loading}
          >
            Back to Home
          </button>
        </div>
      </form>
    </div>
  );
}

export default Answer;
