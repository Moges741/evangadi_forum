import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../Api/axiosConfig";
import styles from "./editAnswer.module.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditAnswer = () => {
  const { answerid } = useParams(); // must match route :answerid
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔹 Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // 🔹 Load existing answer
  useEffect(() => {
    const fetchAnswer = async () => {
      try {
        const { data } = await axios.get(`/answer/single/${answerid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAnswer(data.answer.answer);
      } catch (err) {
        console.error(err);
        setError("Failed to load answer");
        toast.error("Failed to load answer");
      }
    };

    fetchAnswer();
  }, [answerid, token]);

  // 🔹 Update answer
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!answer.trim() || answer.trim().length < 10) {
      // setError("Answer must be at least 10 characters long");
      toast.error("Answer must be at least 10 characters long");
      return;
    }

    try {
      setLoading(true);

      await axios.put(
        `/answer/${answerid}`,
        { answer: answer.trim() },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Answer Updated Successfully!");

      setTimeout(() => {
        navigate(-1);
      }, 1200);
    } catch (err) {
      console.error(err);
      setError("Failed to update answer");
      toast.error("Failed to update answer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Edit Your Answer</h2>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      <form onSubmit={handleUpdate}>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows="10"
          className={styles.textarea}
          disabled={loading}
        />

        <div className={styles.actions}>
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Update Answer"}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className={styles.cancel}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAnswer;
