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
  const [summaryExpanded, setSummaryExpanded] = useState(false);
  const [answerText, setAnswerText] = useState("");

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

  /* ---------------- AUTH CHECK ---------------- */

  useEffect(() => {
    if (!token) navigate("/login", { state: { from: "/ans" } });
  }, [token, navigate]);

  /* ---------------- FETCH DATA ---------------- */

  useEffect(() => {
    const fetchData = async () => {
      try {
        setAnswersLoading(true);

        const [qRes, aRes, sRes] = await Promise.all([
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

        setQuestion(qRes.data.question);
        setAnswers(aRes.data.answers.reverse());
        setSummary(sRes.data.summary || "");
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

      setAnswers(res.data.answers.reverse());

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

        {confirmDeleteAnswerId && (
          <div className={styles.confirm_box}>
            <p>Delete this answer?</p>
            <button onClick={handleConfirmDeleteAnswer}>Yes</button>
            <button onClick={() => setConfirmDeleteAnswerId(null)}>
              Cancel
            </button>
          </div>
        )}

        {answers.map((ans) => (
          <div key={ans.answer_id} className={styles.answer_card}>
            <div className={styles.user_info}>
              <div className={styles.avatar}>
                <IoIosContact size={80} />
              </div>
              <span>{ans.user_name}</span>
            </div>

            <div className={styles.content}>{ans.content}</div>

            <div className={styles.answer_footer}>
              <span className={styles.timestamp}>
                {new Date(ans.created_at).toLocaleDateString()}
              </span>

              {user?.userid === ans.userid && (
                <div className={styles.action_icons}>
                  <MdEdit
                    size={22}
                    color="blue"
                    onClick={() => navigate(`/edit-answer/${ans.answer_id}`)}
                  />
                  <MdDelete
                    size={22}
                    color="red"
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
        <button type="submit" disabled={posting}>
          {posting ? "Posting..." : "Post Answer"}
        </button>
      </form>
    </div>
  );
}

export default Answer;
