export const template = `import express from 'express';
import {{resourceName.toLowerCase()}}Routes from './routes/{{resourceName.toLowerCase()}}.route';
import mongoose from 'mongoose';
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/comment-service";

mongoose
  .connect(mongoUri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.send({ status: 'UP' });
});

app.use('/{{resourceName.toLowerCase()}}s', {{resourceName.toLowerCase()}}Routes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(\`Microservice running on port \${PORT}\`);
});
`;
