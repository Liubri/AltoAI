import ollama from "ollama";
import fs from "node:fs";

export async function generatePlaylist(prompt) {
  const response = await ollama.chat({
    model: "qwen3:0.6b",
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
  });
  console.log(response.message.content);
}

generatePlaylist("Chinese Songs");