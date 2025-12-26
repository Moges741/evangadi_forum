import express from "express";

const app = express();

const port = process.env.PORT || 3000;

app.post('/api/chat', async (req, res) => {
  res.send("no answer for now")
})

app.listen(port, () => {
  console.log(`running on port http://localhost:${port}`);
});
