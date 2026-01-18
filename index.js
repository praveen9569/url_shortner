import express from 'express';
import cors from 'cors';
import userRouter from './routes/user.routes.js';
import { authenticationMiddleware } from './middlewares/auth.middleware.js';
import urlRouter from './routes/url.routes.js';

const app = express();

/* =========================
   CORS CONFIGURATION
========================= */
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://url-shortner-indol-eight.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

/* =========================
   MIDDLEWARE
========================= */
app.use(express.json());

/* =========================
   PUBLIC ROUTES
========================= */
app.get('/', (req, res) => {
  res.send('Welcome to the URL Shortener Service');
});

app.use('/user', userRouter);

/* =========================
   PROTECTED ROUTES
========================= */
app.use(authenticationMiddleware);
app.use(urlRouter);

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
