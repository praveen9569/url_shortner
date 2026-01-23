import 'dotenv/config';
console.log('Step 1: dotenv loaded');

import express from 'express';
console.log('Step 2: express loaded');

import cors from 'cors';
console.log('Step 3: cors loaded');

import { db } from './db/index.js';
console.log('Step 4: db loaded');

import userRouter from './routes/user.routes.js';
console.log('Step 5: userRouter loaded');

import { authenticationMiddleware } from './middlewares/auth.middleware.js';
console.log('Step 6: authenticationMiddleware loaded');

import urlRouter from './routes/url.routes.js';
console.log('Step 7: urlRouter loaded');

console.log('All imports successful!');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'configured' : 'MISSING');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'configured' : 'MISSING');
