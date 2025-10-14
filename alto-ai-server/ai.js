import OpenAI from "openai"
import dotenv from "dotenv"

dotenv.config()
const client = new OpenAI({
	baseURL: "https://router.huggingface.co/v1",
	apiKey: process.env.HF_TOKEN,
});

export async function getAIRequest(req, res) {
  const prompt = req.query.prompt
  try {
    const playlist = await generatePlaylist(prompt);
    console.log("Generated playlist:", playlist);
    console.log(Array.isArray(playlist)); // true
    res.json({playlist});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function generatePlaylist(prompt) {
  const response = await client.chat.completions.create({
    model: "openai/gpt-oss-20b:nebius",
    messages: [
      { role: "system", content: "You are a multilingual music recommendation assistant." },
      { role: "user", content: `Generate a playlist of 10 songs for: ${prompt}
      Return **ONLY** a JSON array in this exact format:
      [
     { "title": "Song Name", "artist": "Artist Name" }
    ]
    Do not include any explanations or text.` }
    ],
    temperature: 0.7
  });
  const playlistJSON = response.choices[0].message.content;
  console.log(JSON.stringify(response.choices[0].message));
  console.log(response);
  return JSON.parse(playlistJSON);
}