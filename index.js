import express from 'express';
import userRouter from './routes/user.routes.js';
import { authenticationMiddleware } from './middlewares/auth.middleware.js';
import urlRouter from './routes/url.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// CORS middleware
const allowedOrigins = [
  "http://localhost:5173",
  process.env.ORIGIN
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());

// Apply authentication middleware globally
app.use(authenticationMiddleware);

app.get('/', (req, res) => {
  res.send('Welcome to the URL Shortener Service');
});

// Routes
app.use('/user', userRouter);
app.use('/', urlRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
