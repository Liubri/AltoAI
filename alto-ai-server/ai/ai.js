import OpenAI from "openai"
import dotenv from "dotenv"
import fs from "node:fs";
import models from "./models.js";

const defaultModel = "OpenRouter";

dotenv.config()


export async function getAIRequest(req, res, user) {
  const prompt = req.query.prompt
  try {
    const playlist = await generatePlaylist(prompt);
    console.log("Generated playlist:", playlist);
    console.log(Array.isArray(playlist)); 
    res.json({playlist});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function generatePlaylist(prompt, ai=models[defaultModel]) {
  const response = await ai.client.chat.completions.create({
    model:ai.model,
    messages: [
      {
        role: "system",
        content: fs.readFileSync(new URL("./prompt.txt", import.meta.url), "utf-8"),
      },
      {
        role: "user",
        content: `You are a Spotify search prompt generator. "${prompt}"`,
      },
    ],
    temperature: ai.temperature
  });
  let playlistJSON = JSON.parse(response.choices[0].message.content.trim());
  console.log(playlistJSON);
  return playlistJSON;
}