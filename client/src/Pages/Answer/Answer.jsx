import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../Api/axiosConfig";

function Answer() {
  // How React knows WHICH question to load
  const { question_id } = useParams();
  // for use of redirecting
  const navigate = useNavigate();
  //
  const token = localStorage.getItem("token");

  const [answer, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [answerText, setAnswerText] = useState("");
  const [error, setError] = useState(null);

  //1. Fetch answers
  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/answer/${question_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAnswers(res.data.answers);
      } catch (err) {
        if (err.response?.status === 404) {
          setError("Question not found.");
        } else {
          setError("Failed to load answers.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnswers();
  }, [question_id, token]);

  //   2. Submit answer
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!answerText.trim()) {
      setError("Please provide an answer.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        "/answer",
        {
          questionid: Number(question_id),
          answer: answerText.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 3. Refresh answers
      const res = await axios.get(`/answer/${question_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAnswers(res.data.answers);
      setAnswerText("");
      setError(null);
    } catch (err) {
      setError("Failed to post answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Answers</h2>

      {error && <p className={styles.error}>{error}</p>}
      {loading && <p>Loading...</p>}

      {answers?.length === 0 && !loading && (
        <p className={styles.no_answers}>No answers yet. Be the first!</p>
      )}
      <div className={styles.answer_list}>
        {answers?.map((ans) => (
          <div key={ans.answer_id} className={styles.answer_card}>
            <p className={styles.content}>{ans.content}</p>
            <div className={styles.meta}>
              <span>{ans.user_name}</span>
              <span>{new Date(ans.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className={styles.answer_form}>
        <h3>Your Answer</h3>
        <textarea
          rows="6"
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          placeholder="Write your answer here..."
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post Answer"}
        </button>
      </form>
    </div>
  );
}

export default Answer;

{
  /* // import React, { useEffect, useState } from "react";
// import styles from "./answer.module.css";
// import axios from "../../Api/axiosConfig";
// import { useParams, useNavigate } from "react-router-dom";

// function Answer() { */
}
{
  /* //   const { question_id } = useParams();
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const [answers, setAnswers] = useState([]);
//   const [answerText, setAnswerText] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Redirect if not logged in
//   useEffect(() => { */
}
//     if (!token) {
//       navigate("/login", { state: { from: `/question/${question_id}` } });
//     }
//   }, [token, navigate, question_id]);

//   // Fetch answers
//   useEffect(() => {
//     const fetchAnswers = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get(`/answer/${question_id}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setAnswers(res.data.answers);
//       } catch (err) {
//         if (err.response?.status === 404) {
//           setError("Question not found.");
//         } else {
//           setError("Failed to load answers.");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAnswers();
//   }, [question_id, token]);

//   // Submit answer
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!answerText.trim()) {
//       setError("Please provide an answer.");
//       return;
//     }

//     try {
//       setLoading(true);
//       await axios.post(
//         "/answer",
//         {
//           questionid: Number(question_id),
//           answer: answerText.trim(),
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       // Refresh answers
//       const res = await axios.get(`/answer/${question_id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setAnswers(res.data.answers);
//       setAnswerText("");
//       setError(null);
//     } catch (err) {
//       setError("Failed to post answer. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <h2>Answers</h2>

//       {error && <p className={styles.error}>{error}</p>}
//       {loading && <p>Loading...</p>}

//       {answers.length === 0 && !loading && (
//         <p className={styles.no_answers}>No answers yet. Be the first!</p>
//       )}

//       <div className={styles.answer_list}>
//         {answers.map((ans) => (
//           <div key={ans.answer_id} className={styles.answer_card}>
//             <p className={styles.content}>{ans.content}</p>
//             <div className={styles.meta}>
//               <span>{ans.user_name}</span>
//               <span>{new Date(ans.created_at).toLocaleDateString()}</span>
//             </div>
//           </div>
//         ))}
//       </div>

//       <form onSubmit={handleSubmit} className={styles.answer_form}>
//         <h3>Your Answer</h3>
//         <textarea
//           rows="6"
//           value={answerText}
//           onChange={(e) => setAnswerText(e.target.value)}
//           placeholder="Write your answer here..."
//           disabled={loading}
//         />
//         <button type="submit" disabled={loading}>
//           {loading ? "Posting..." : "Post Answer"}
//         </button>
//       </form>
//     </div>
//   );
// }

// export default Answer;
