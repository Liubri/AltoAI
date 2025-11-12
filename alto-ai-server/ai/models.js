import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const models = {
     HF: {
        client: new OpenAI({
        baseURL: "https://router.huggingface.co/v1",
        apiKey: process.env.HF_TOKEN,
        }),
        model: "openai/gpt-oss-20b:nebius",
        temperature: 0.7,
    },
    OpenRouter: {
        client: new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OR_TOKEN,
        }),
        model: "meta-llama/llama-3.3-8b-instruct:free",
        temperature: 0.7,
    },
    Ollama: {
        client: new OpenAI({
            baseURL: 'http://localhost:11434/v1',
            apiKey: 'ollama',
        }),
        model: "gpt-oss:20b",
        temperature: 0.7,
    }
};

export default models;