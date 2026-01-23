import {validateUserToken} from '../utils/token.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {void}
 * Middleware to authenticate user based on JWT token in Authorization header.
 */
export function authenticationMiddleware(req, res, next) {
    // Skip auth for public routes
    if (req.path === '/user/signup' || req.path === '/user/login' || req.path === '/' || req.path.startsWith('/short/')) {
        return next();
    }

    // Allow public redirects for shortened URLs
    if (req.path.startsWith('/short')) {
        return next();
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        console.log('Auth failed: No token provided for path:', req.path);
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const user = validateUserToken(token);
        // Normalize userId to id for consistency
        req.user = {
            id: user.userId || user.id,
            email: user.email,
            userId: user.userId || user.id
        };
        console.log('Auth successful for user:', req.user.id);
        next();
    } catch (err) {
        console.log('Auth failed: Invalid token -', err.message);
        return res.status(403).json({ error: 'Invalid token' });
    }
}
