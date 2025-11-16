import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const models = {
    nvidia: {
        client: new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OR_TOKEN,
        }),
        model: "nvidia/nemotron-nano-12b-v2-vl:free",
        temperature: 0.7,
    },
    deepseek: {
        client: new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OR_TOKEN,
        }),
        model: "deepseek/deepseek-chat-v3.1:free",
        temperature: 0.7,
    },
    openai: {
        client: new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OR_TOKEN,
        }),
        model: "openai/gpt-oss-20b:free",
        temperature: 0.7,
    },
    qwen: {
        client: new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OR_TOKEN,
        }),
        model: "qwen/qwen3-4b:free",
        temperature: 0.7,
    },
};

export default models;