import { StatusCodes } from "http-status-codes";
import dbConnection from "../DB/dbconfig.js";
import OpenAI from "openai";
import dotenv from "dotenv";
import xss from "xss";

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
        u.username AS user_name,
        a.created_at,
        a.userid,
        u.profile_picture
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

//1. Prepare OpenAI Connection
dotenv.config();
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// Extracts question_id from the URL params
const getAnswerSummary = async (req, res) => {
  const { question_id } = req.params;

  try {
    // Fetch Question details and its Answers from question asked by question id
    const [question] = await dbConnection.query(
      "SELECT title, description FROM questions WHERE questionid = ?",
      [question_id]
    );
    // Fetch answer from answers
    const [answers] = await dbConnection.query(
      "SELECT answer FROM answers WHERE questionid = ?",
      [question_id]
    );
    //   insert error response if question not found

    if (question.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Question not found" });
    }
    //   insert error response if there is no answer
    if (answers.length === 0) {
      return res
        .status(StatusCodes.OK)
        .json({ summary: "No answers yet to summarize." });
    }

    // 2. Prepare the payload for AI
    // Prepare answers payload for AI summarization
    const allAnswersText = answers
      .map((a, i) => `Answer ${i + 1}: ${a.answer}`)
      .join("\n\n");

    const messages = [
      {
        role: "system",
        content: `You are a high-precision data summarizer. 
        TASK: Summarize technical solutions provided in the text.
        CONSTRAINTS:
        - DO NOT mention "the community," "users," or "the forum."
        - DO NOT use introductory phrases like "It seems like" or "The consensus is."
        - DO NOT explain what you are doing.
        - Start immediately with the core technical summary.
        - Maximum 3 concise sentences.`,
      },
      {
        role: "user",
        content: `Question Title: ${question[0].title}
        Description: ${question[0].description}
        
        Answers to summarize:
        ${allAnswersText}`,
      },
    ];

    // 3. Request AI Summary
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      // model:"openai/gpt-oss-20b",
      messages,
      temperature: 0.3, // Lower temperature for more factual summaries
    });

    const summaryText = completion.choices[0].message.content;

    //   4. Return the summary
    return res.status(StatusCodes.OK).json({
      summary: summaryText,
      answerCount: answers.length,
    });
  } catch (error) {
    console.error("Summarization Error:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to summarize answers" });
  }
};

const postAnswer = async (req, res) => {
  const { question_id, answer } = req.body;

  // validate input
  if (!question_id || !answer) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "question_id and answer are required",
    });
  }

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

    // get logged-in user
    const userId = req.user.userid;

    // insert answer
    await dbConnection.query(
      "INSERT INTO answers (questionid, userid, answer) VALUES (?, ?, ?)",
      [questionIdNum, userId, answer]
    );

    return res.status(StatusCodes.CREATED).json({
      message: "Answer posted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};

// Edit Answer
const editAnswer = async (req, res) => {
  const { answer_id } = req.params;
  const { answer } = req.body;
  const userId = req.user?.userid;

  // Validate answer_id
  const answerIdNum = parseInt(answer_id, 10);
  if (isNaN(answerIdNum)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid answer_id",
    });
  }

  // Validate answer content
  if (!answer) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Answer content is required",
    });
  }

  try {
    // Check if answer exists and belongs to user
    const [existingAnswer] = await dbConnection.query(
      "SELECT userid FROM answers WHERE answerid = ?",
      [answerIdNum]
    );

    if (existingAnswer.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Answer not found",
      });
    }

    if (existingAnswer[0].userid !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "You can only edit your own answers",
      });
    }

    // Sanitize answer
    const sanitizedAnswer = xss(answer);

    // Update answer
    await dbConnection.query(
      "UPDATE answers SET answer = ? WHERE answerid = ? AND userid = ?",
      [sanitizedAnswer, answerIdNum, userId]
    );

    return res.status(StatusCodes.OK).json({
      message: "Answer updated successfully",
    });
  } catch (error) {
    console.error("Error editing answer:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};

//Delete Answer
const deleteAnswer = async (req, res) => {
  const { answer_id } = req.params;
  const userId = req.user?.userid;

  // Validate answer_id
  const answerIdNum = parseInt(answer_id, 10);
  if (isNaN(answerIdNum)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid answer_id",
    });
  }

  try {
    // Check if answer exists and belongs to user
    const [existingAnswer] = await dbConnection.query(
      "SELECT userid FROM answers WHERE answerid = ?",
      [answerIdNum]
    );

    if (existingAnswer.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Answer not found",
      });
    }

    if (existingAnswer[0].userid !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "You can only delete your own answers",
      });
    }

    // Delete answer
    await dbConnection.query(
      "DELETE FROM answers WHERE answerid = ? AND userid = ?",
      [answerIdNum, userId]
    );

    return res.status(StatusCodes.OK).json({
      message: "Answer deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting answer:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};
const getSingleAnswer = async (req, res) => {
  const { answer_id } = req.params;

  // Validate answer_id
  const answerIdNum = parseInt(answer_id, 10);
  if (isNaN(answerIdNum)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Invalid answer_id",
    });
  }

  try {
    const [answer] = await dbConnection.query(
      `
      SELECT 
        a.answerid,
        a.answer,
        a.questionid,
        a.userid,
        a.created_at,
        u.username
      FROM answers a
      JOIN users u ON a.userid = u.userid
      WHERE a.answerid = ?
      `,
      [answerIdNum]
    );

    if (answer.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Answer not found",
      });
    }

    return res.status(StatusCodes.OK).json({
      answer: answer[0],
    });
  } catch (error) {
    console.error("Error fetching single answer:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};

export {
  getAnswers,
  postAnswer,
  getAnswerSummary,
  editAnswer,
  deleteAnswer,
  getSingleAnswer,
};
