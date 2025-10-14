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
    console.log("Generated playlist:", playlist);
    console.log(Array.isArray(playlist)); // true
    res.json({ playlist });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function generatePlaylist(prompt) {
  const response = await client.chat.completions.create({
    model: "mistralai/mistral-7b-instruct:free",
    messages: [
      { role: "system", content: `You are a music recommendation assistant.
        When the user requests songs from a specific language or country, you must write the song and artist names in that language's native script.
For example:
- If the user asks for Chinese songs → use Chinese titles.
- If the user asks for Japanese songs → use Japanese titles.
- If the user asks for Korean songs → use Hangul.
Do not include any explanations or text, or markdown.` },
      {
        role: "user",
        content: `Generate a playlist of 10 songs for: ${prompt}
      Return **ONLY** a JSON array in this exact format:
      [
     { "title": "Song Name", "artist": "Artist Name" }
    ]
    `,
      },
    ],
    temperature: 0.7,
  });
  let playlistJSON = response.choices[0].message.content.trim();
  console.log("Not cleaned JSON", playlistJSON);
  playlistJSON = playlistJSON
    .replace(/```json/i, "") // remove ```json
    .replace(/```/g, "") // remove remaining ```
    .trim();
  const match = playlistJSON.match(/\[\s*{[\s\S]*}\s*\]/);
  if (!match) {
    console.error(
      "❌ Could not find valid JSON array in model output:",
      playlistJSON
    );
    throw new Error("Model did not return a valid JSON array.");
  }

  const cleanJSON = match[0]; // only take the JSON array
  console.log("🧾 Cleaned JSON output:", cleanJSON);
  //console.log(JSON.stringify(response.choices[0].message));
  //console.log("Response:", response);
  return JSON.parse(cleanJSON);
}
