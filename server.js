import 'dotenv/config';
import express from 'express';
import router from './routes.js';

const port = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware - log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Body:', req.body);
  console.log('Content-Type:', req.headers['content-type']);
  next();
});

// Routes
app.use('/api/shows', router);

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.log(`DB Connection: ${process.env.DB_CONNECTION_STRING ? 'Loaded' : 'NOT LOADED'}`);
});