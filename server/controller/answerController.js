import { StatusCodes } from "http-status-codes";
import dbConnection from "../DB/dbconfig.js";
import OpenAI from "openai";
import dotenv from "dotenv";

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
        a.created_at
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

    const prompt = `
    You are an expert forum moderator. Below is a question and a list of answers.
    Summarize the main solutions provided by the community. 
    Keep it under 3 sentences and use a helpful tone.

    Question: ${question[0].title}
    Description: ${question[0].description}

    Answers:
    ${allAnswersText}
`;

    // 3. Request AI Summary
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
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

export { getAnswers, postAnswer, getAnswerSummary };
