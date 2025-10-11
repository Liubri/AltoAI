import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors()); // allow frontend requests
app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Node.js!' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});