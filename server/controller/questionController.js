import dbConnection from "../DB/dbconfig.js";
import { StatusCodes } from "http-status-codes";
import xss from 'xss'

async function getAllQuestions(req, res) {
  try {
    // Get all questions from the database (updated to handle missing created_at column)
    const [questions] = await dbConnection.execute(
      `SELECT 
        q.questionid,
        q.title,
        q.description,
        q.tag,
        q.userid,
        u.username,
        u.firstname,
        u.lastname
      FROM questions q 
      JOIN users u ON q.userid = u.userid 
      ORDER BY q.questionid DESC`
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

const postQuestion = async (req, res) => {
    try{
        const {title , description , tag } = req.body;
        const userId = req.user?.userid;

        if(!title || !description || !userId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Title, Description and userId required",
            });
        }
        // Validate tag length 
        if(tag && tag.length > 20){
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Tag must be less than 20 characters",
            }); 
        }
        // Sanitize inputs to prevent XSS
        const sanitizedTitle = xss(title);
        const sanitizedDescription = xss(description);
        const sanitizedTag = tag ? xss(tag) : null;

        const [result] = await dbConnection.query(
            "INSERT INTO questions(title, description, tag, userid)  VALUES (? , ? , ? , ?)",
            [sanitizedTitle, sanitizedDescription, sanitizedTag, userId]
        );
        res.status(StatusCodes.CREATED).json({
            message: "Question Posted Successfully!",
            questionId: result.insertId,     
            
        });      
    }catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Error posting question",
            error: error.message,
        });
    }
}

export { getAllQuestions, getSingleQuestion, postQuestion };
