import { StatusCodes } from "http-status-codes";
import dbConnection from "../DB/dbconfig.js";

const getAnswers = async (req, res) => {
const { question_id } = req.params;

  // validate question_id
const questionIdNum = parseInt(question_id, 10);
if (isNaN(questionIdNum)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
    message: "Invalid question_id",
    });
}

try {
    // check if question exists
    const [question] = await dbConnection.query(
        "SELECT questionid FROM questions WHERE questionid = ?",
        [questionIdNum]
    );

if (question.length === 0) {
    return res.status(StatusCodes.NOT_FOUND).json({
        message: "Question not found",
    });
    }

    // get answers
const [answers] = await dbConnection.query(
        `SELECT 
        a.answerid AS answer_id,
        a.answer AS content,
        u.username AS user_name
    FROM answers a
    JOIN users u ON a.userid = u.userid
    WHERE a.questionid = ?`,
    [questionIdNum]
    );

    return res.status(StatusCodes.OK).json({ answers });
    } catch (error) {
    console.error("Error getting answers:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
    });
    }
};

// Add initial postAnswer function structure 

const postAnswer = async (req, res) => {
  const { question_id, answer } = req.body;

}
export { getAnswers,postAnswer };
