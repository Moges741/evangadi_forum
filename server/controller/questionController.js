// database connection to be imported from  collaborators
import dbConnection from "../DB/dbconfig.js";
import { StatusCodes } from "http-status-codes";

async function getAllQuestions(req, res) {
  try {
    // Get all questions from the database (updated to match your schema)
    const [questions] = await dbConnection.execute(
      `SELECT 
        q.questionid,
        q.title,
        q.description,
        q.tag,
        q.created_at,
        q.userid,
        u.username,
        u.firstname,
        u.lastname
      FROM questions q 
      JOIN users u ON q.userid = u.userid 
      ORDER BY q.created_at DESC`
    );

    // Check if the questions array is empty
    if (questions.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "No questions found.",
      });
    }

    return res.status(StatusCodes.OK).json({
      message: "Questions retrieved successfully",
      questions: questions,
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "An unexpected error occurred",
      error: error.message,
    });
  }
}

// ====================================Muller Task=============================
// get a single question

async function getSingleQuestion(req, res) {
  const { questionid } = req.params;
  try {
    const [question] = await dbConnection.execute(
      `SELECT 
        q.questionid,
        q.title,
        q.description,
        q.tag,
        q.created_at,
        q.userid,
        u.username,
        u.firstname,
        u.lastname
      FROM questions q 
      JOIN users u ON q.userid = u.userid 
      WHERE q.questionid = ?`,
      [questionid]
    );
    // if the questioon not found
    if (question.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Question not found.",
      });
    }

    return res.status(StatusCodes.OK).json({
      message: "Question retrieved successfully",
      question: question[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "an error occured, try again",
      error: error.message,
    });
  }
}

// ====================================Muller Task=============================

export { getAllQuestions, getSingleQuestion };
