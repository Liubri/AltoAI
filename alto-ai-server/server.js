import express from 'express'
import cors from 'cors'
import { getAIRequest } from './ai.js'
import dotenv from "dotenv"

dotenv.config()
const app = express();
app.use(cors()); // allow frontend requests
app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Node.js!' });
});

app.get('/api/openai', getAIRequest);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});