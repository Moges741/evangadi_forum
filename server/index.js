import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const app = express();

const port = process.env.PORT || 3000;
app.use(express.json());
app.post("/api/chat", async (req, res) => {
  const { prompt } = req.body;
  const model = "llama-3.3-70b-versatile";
  const SYSTEM_PROMPT = `
    You are a high-efficiency AI assistant. 
    RULES:
    1. Be direct. Do not use filler phrases like "Here is the solution" or "I hope this helps."
    2. For code, provide the code block immediately with brief comments explaining the logic.
    3. For explanations, use bullet points and bold text for readability.
    4. If the answer is short, keep it short. If it requires depth, provide depth without fluff.
    5. Maintain context of the previous conversation. 
  `;
  const input = SYSTEM_PROMPT + prompt;
  try {
    const response = await client.responses.create({
      model,
      input,
      temperature: 0.2,
      max_output_tokens: 1024,
    });
    const answer = response.output_text;
    res.json({ answer });
  } catch (err) {
    console.log("error: ", err);
    res.json({ error: "Failed to generate a response." });
  }
});

app.listen(port, () => {
  console.log(`running on port http://localhost:${port}`);
});
