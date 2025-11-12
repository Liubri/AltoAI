ximport OpenAI from "openai";
import dotenv from "dotenv";
import fs from "node:fs";

dotenv.config();
const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OR_TOKEN,
});

export async function getAIRequest(req, res) {
  const prompt = req.query.prompt;
  try {
    const playlist = await generatePlaylist(prompt);
    console.log(Array.isArray(playlist));
    res.json({ playlist });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function generatePlaylist(prompt) {
  const response = await client.chat.completions.create({
    model: "meta-llama/llama-3.3-8b-instruct:free",
    messages: [
      {
        role: "system",
        content: fs.readFileSync("./prompt.txt", "utf-8"),
      },
      {
        role: "user",
        content: `You are a Spotify search prompt generator. "${prompt}"`,
      },
    ],
    temperature: 0.7,
  });
  let playlistJSON = JSON.parse(response.choices[0].message.content.trim());
  console.log(playlistJSON);
  return playlistJSON;
}
