import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OR_TOKEN,
});

export async function getAIRequest(req, res) {
  const prompt = req.query.prompt;
  try {
    const playlist = await generatePlaylist(prompt);
    // console.log("Generated playlist:", playlist);
    console.log(Array.isArray(playlist)); // true
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
        content: `You are a Spotify music query generator.

Your job is to interpret the user's input and output a valid JSON array of 5 Spotify search queries.
Rules:
- Output MUST be a valid JSON array of 5 strings.
- Each string MUST be a real-world Spotify search query that returns many songs. 
- No invented artists or songs.
- Keep strings short: just song names, artist names, or genres.
- At least include one genre in the array.
- No explanation, no markdown, no numbering, no extra text — ONLY the JSON array.
- If the search prompt is in another language use that language

Behavior rules:
1. If the user mentions ONLY artist names (e.g. "Taylor Swift", "IU, SEVENTEEN", "LE SSERAFIM and NewJeans"),
   then output an array containing ONLY those artist names (repeat or fill with them if needed to reach 5 items).
   Example:
   User: "IU, SEVENTEEN"
   Output: ["IU", "NewJeans", "LE SSERAFIM", "NewJeans", "SEVENTEEN"]

Examples:

User Input: "下雨天"
Output: ["雨天音乐", "下雨天气", "小雨天气", "雨声放松", "天气预报"]

User Input: "I like Japanese songs"
Output: ["YOASOBI", "Japanese City Pop", "Fuji Kaze", "Anime Music", "Hatsune Miku"]

User Input: "sad kpop"
Output: ["Korean Ballad", "IU", "Sad K-pop", "SEVENTEEN", "Emotional K-pop"]

User Input: "hype workout"
Output: ["EDM Workout", "High Energy Pop", "Trap Workout", "Gym Motivation", "Hardstyle"]

If the user mentions multiple artists or genres, include all of them in the array.
`,
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
