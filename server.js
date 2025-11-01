import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("."));

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/predict", async (req, res) => {
  const { plant, extract, conc } = req.body;
  const prompt = `Predict the antimicrobial outcome of ${plant} (${extract} extract) at ${conc}% concentration against Aspergillus niger. Explain briefly.`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      }),
    });

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || "No response from AI.";

    res.json({ result });
  } catch (error) {
    res.json({ result: "Error: " + error.message });
  }
});

app.listen(10000, () => console.log("✅ Server running on port 10000"));
