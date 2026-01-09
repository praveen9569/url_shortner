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
    // Skip auth for signup and login routes
    if (req.path === '/user/signup' || req.path === '/user/login') {
        return next();
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const user = validateUserToken(token);
        // Normalize userId to id
        if (user.userId && !user.id) {
            user.id = user.userId;
        }
        req.user = user;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid token' });
    }
}

export function ensureAuthenticated(req, res, next) {
    if (!req.user || (!req.user.id && !req.user.userId)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    // Normalize userId to id for consistency
    if (req.user.userId && !req.user.id) {
        req.user.id = req.user.userId;
    }
    next();
}