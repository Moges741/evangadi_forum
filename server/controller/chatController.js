import OpenAI from "openai";
import db from "../DB/dbconfig.js"; 
import dotenv from "dotenv";

dotenv.config();
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export const getChatResponse = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "userid and prompt are required." });
  }

  const {userid} = req.user;

  try {
    const [history] = await db.execute(
      `SELECT role, content FROM chat_history 
       WHERE userid = ? 
       ORDER BY chatid DESC LIMIT 30`,
      [userid]
    );

    console.log("history", history)

    const conversationContext = history.reverse();

    const SYSTEM_PROMPT = {
      role: "system",
      content: "You are a direct, high-efficiency AI assistant. No fluff.",
    };

    
    const messages = [
      SYSTEM_PROMPT,
      ...conversationContext,
      { role: "user", content: prompt },
    ];


    const completion = await client.chat.completions.create({
      messages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      max_tokens: 1024,
    });

    const aiResponse = completion.choices[0].message.content;

    const insertQuery = `INSERT INTO chat_history (userid, role, content) VALUES (?, 'user', ?), (?, 'assistant', ?)`;
    await db.execute(insertQuery, [userid, prompt, userid, aiResponse]);

    res.json({ answer: aiResponse });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
