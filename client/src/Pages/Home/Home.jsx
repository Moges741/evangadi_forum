// // ===================== Desalegn Tsega — Implement Home Page Start =====================
// // React core hooks
// import React, { useContext, useEffect, useState } from "react";

// // Global app context
// import { AppState } from "../../App";

// // Routing utilities
// import { Link, useNavigate } from "react-router-dom";

// // Axios instance
// import axios from "../../Api/axiosConfig";

// // CSS module
// import classes from "./home.module.css";

// // Icons
// import { MdEdit, MdDelete } from "react-icons/md";
// import { IoIosContact } from "react-icons/io";

// const Home = () => {
//   // Get logged-in user from global state
//   const { user } = useContext(AppState);
//   // Navigation hook
//   const navigate = useNavigate();
//   // ===================== STATE =====================
//   const [questions, setQuestions] = useState([]); // All questions from API
//   const [sortedQuestions, setSortedQuestions] = useState([]); // Sorted questions
//   const [searchQuery, setSearchQuery] = useState(""); // Search input
//   const [sortOption, setSortOption] = useState("Most Recent"); // Sorting option
//   const [successMessage, setSuccessMessage] = useState(""); // Success alert
//   const [errorMessage, setErrorMessage] = useState(""); // Error alert
//   const [confirmDeleteId, setConfirmDeleteId] = useState(null); // Delete confirmation ID

//   // Auth token
//   const token = localStorage.getItem("token");

//   // ===================== FETCH DATA =====================
//   // Fetch all questions from backend
//   const fetchData = async () => {
//     try {
//       const { data } = await axios.get("/questions/all-list-questions", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // Save questions to state
//       setQuestions(data?.questions || []);
//       setSortedQuestions(data?.questions || []);
//     } catch (error) {
//       console.error("Error fetching questions:", error);
//     }
//   };

//   // Fetch questions on component mount
//   useEffect(() => {
//     if (token) fetchData();
//   }, [token]);

//   // ===================== SORTING =====================
//   // Re-sort whenever questions or sort option changes
//   useEffect(() => {
//     let sortedData = [...questions];

//     switch (sortOption) {
//       case "Most Recent":
//         sortedData.sort(
//           (a, b) => new Date(b.created_at) - new Date(a.created_at)
//         );
//         break;

//       case "Most Popular":
//         sortedData.sort((a, b) => (b.views || 0) - (a.views || 0));
//         break;

//       case "By Questions":
//         sortedData.sort((a, b) => a.title.localeCompare(b.title));
//         break;

//       case "By Date":
//         sortedData.sort(
//           (a, b) => new Date(a.created_at) - new Date(b.created_at)
//         );
//         break;

//       default:
//         break;
//     }

//     setSortedQuestions(sortedData);
//   }, [questions, sortOption]);

//   // ===================== SEARCH FILTER =====================
//   // Filter by question title OR username
//   const filteredQuestions = sortedQuestions.filter((q) => {
//     const searchText = searchQuery.toLowerCase();
//     return (
//       q.title.toLowerCase().includes(searchText) ||
//       q.username.toLowerCase().includes(searchText)
//     );
//   });

//   // ===================== DELETE LOGIC =====================
//   // Open delete confirmation dialog
//   const handleDelete = (id) => setConfirmDeleteId(id);

//   // Confirm deletion
//   const handleConfirmDelete = async () => {
//     try {
//       await axios.delete(`/questions/delete-question/${confirmDeleteId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // Remove deleted question from state
//       setQuestions((prev) =>
//         prev.filter((q) => q.questionid !== confirmDeleteId)
//       );

//       // Show success message
//       setSuccessMessage(t("home.deleteSuccess"));
//       setTimeout(() => setSuccessMessage(""), 3000);
//     } catch {
//       // Show error message
//       setErrorMessage(t("home.deleteError"));
//       setTimeout(() => setErrorMessage(""), 3000);
//     } finally {
//       // Close confirmation dialog
//       setConfirmDeleteId(null);
//     }
//   };

//   // ===================== UI =====================
//   return (
//     <section>
//       <div className={classes["main-container"]}>
//         {/* Header section */}
//         <div className={classes["welcome-section"]}>
//           <Link to="/ask" className={classes["ask-question-btn"]}>
//             {t("home.askQuestion")}
//           </Link>

//           <div className={classes["welcome-message"]}>
//             {t("home.welcome")} :
//             <span className={classes["username"]}> {user?.username}</span>
//           </div>
//         </div>

//         {/* Search input */}
//         <div className={classes["search-bar"]}>
//           <input
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className={classes["search-input"]}
//             placeholder={t("home.searchPlaceholder")}
//           />
//         </div>

//         {/* Sorting dropdown */}
//         <div className={classes["sort-dropdown"]}>
//           <select
//             value={sortOption}
//             onChange={(e) => setSortOption(e.target.value)}
//             className={classes["sort-select"]}
//           >
//             <option value="Most Recent">{t("home.mostRecent")}</option>
//             <option value="Most Popular">{t("home.mostPopular")}</option>
//             <option value="By Questions">{t("home.byQuestions")}</option>
//             <option value="By Date">{t("home.byDate")}</option>
//           </select>
//         </div>

//         {/* Alerts */}
//         {successMessage && (
//           <div className={classes["success-message"]}>{successMessage}</div>
//         )}
//         {errorMessage && (
//           <div className={classes["error-message"]}>{errorMessage}</div>
//         )}

//         {/* Delete confirmation */}
//         {confirmDeleteId !== null && (
//           <div className={classes["confirmation-prompt"]}>
//             <p>{t("home.confirmDelete")}</p>
//             <button className="btn btn-danger" onClick={handleConfirmDelete}>
//               {t("home.yesDelete")}
//             </button>
//             <button
//               className="btn btn-secondary"
//               onClick={() => setConfirmDeleteId(null)}
//             >
//               {t("home.cancel")}
//             </button>
//           </div>
//         )}

//         {/* Questions list */}
//         {filteredQuestions.length > 0 ? (
//           filteredQuestions.map((q) => (
//             <div className={classes["questions-list"]} key={q.questionid}>
//               <div className={classes["question-item"]}>
//                 <Link
//                   to={`/question/${q.questionid}`}
//                   className={classes["question-link"]}
//                 >
//                   <div className={classes["user-info"]}>
//                     <div className={classes["user"]}>
//                       <IoIosContact size={80} />
//                       <p>{q.username}</p>
//                     </div>
//                     <div className={classes["question-text"]}>{q.title}</div>
//                   </div>
//                 </Link>

//                 {/* Metadata and owner actions */}
//                 <div className={classes["info-and-actions"]}>
//                   <span className={classes["timestamp"]}>
//                     {new Date(q.created_at).toLocaleString()}
//                   </span>

//                   {user?.username === q.username && (
//                     <div className={classes["action-icons"]}>
//                       <MdEdit
//                         size={24}
//                         color="blue"
//                         onClick={() =>
//                           navigate(`/edit-question/${q.questionid}`)
//                         }
//                       />
//                       <MdDelete
//                         size={24}
//                         color="red"
//                         onClick={() => handleDelete(q.questionid)}
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p>{t("home.noQuestions")}</p>
//         )}
//       </div>
//     </section>
//   );
// };

// export default Home;
// // ===================== Desalegn Tsega — Implement Home Page End =====================

import { useEffect, useState } from "react";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import styles from "./home.module.css";
// import LayOut from "../Layout/LayOut";
import { Link } from "react-router-dom";
import axios from "../../Api/axiosConfig.js";
// import { AuthContext } from "../../App";
import { AppState } from "../../App.jsx";
import { useContext } from "react";
import QuestionCard from "./QuestionCard.jsx";

//main home page
function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useContext(AppState);
  const [allquestions, setAllQuestions] = useState([]);

  console.log(user);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const allQuestion = await axios.get("/question");
        setAllQuestions(allQuestion.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchQuestions();
  }, [user]);

  const filterdQuestion = allquestions.filter((question) =>
    question.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  console.log(allquestions);

  return (
    // <LayOut>
    <div className={styles.home__container__wrap}>
      <section className={styles.home_container}>
        {/* button container for asking questions and welcoming the user  */}
        <div className={styles.btn_container}>
          <Link to="/Askquestion">
            {/* link for ask question button  */}
            <button className={styles.ask_blue}>Ask Question</button>
          </Link>

          <p>
            welcome: <span>{user ? user.username : "Guest"}</span>
          </p>
          {/* greeting the username  */}
        </div>
        {/* search input for questions  */}
        <div className={styles.search_container}>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            placeholder="Search question"
          />
        </div>
        {/* horizontal separate line  */}
        <div className={styles.home__QuestionCard_box}>
          <div className={styles.horizontal_line}>
            <hr />
          </div>

          {/* user details section  */}
          {filterdQuestion.length > 0 ? (
            filterdQuestion.map((question, i) => (
              <QuestionCard key={i} Questions={question} />
            ))
          ) : (
            <p>No Question Found</p>
          )}
        </div>
      </section>
    </div>
    // </LayOut>
  );
}

export default Home;
