import 'dotenv/config';  // Add this at the very top
import express from 'express';
import cors from 'cors';
import userRouter from './routes/user.routes.js';
import { authenticationMiddleware } from './middlewares/auth.middleware.js';
import urlRouter from './routes/url.routes.js';
import analyticsRouter from './routes/analytics.routes.js';

const app = express();

/* =========================
   CORS CONFIGURATION
========================= */
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://url-shortner-indol-eight.vercel.app",
    process.env.CORS_ORIGIN
  ].filter(Boolean), // Filter out undefined if env var is not set
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
  res.json({
    status: 'ok',
    message: 'Welcome to the URL Shortener Service',
    timestamp: new Date().toISOString()
  });
});

app.use('/user', userRouter);

/* =========================
   PROTECTED ROUTES
========================= */
app.use(authenticationMiddleware);
app.use(urlRouter);
app.use('/api/analytics', analyticsRouter);

/* =========================
   ERROR HANDLING
========================= */
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Database URL: ${process.env.DATABASE_URL ? 'configured' : '⚠️  MISSING'}`);
  console.log(`🔑 JWT Secret: ${process.env.JWT_SECRET ? 'configured' : '⚠️  MISSING'}`);
});
