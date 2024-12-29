export const template = `import express from 'express';
import {{resourceName.toLowerCase()}}Routes from './routes/{{resourceName.toLowerCase()}}.route';
import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/{{resourceName.toLowerCase()}}s').then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
})

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
