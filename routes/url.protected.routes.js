import express from 'express';
import { shortenPostRequestBodySchema } from '../validation/request.validation.js';
import { db } from '../db/index.js';
import { urlsTable } from '../models/index.js';
import { nanoid } from 'nanoid';

const router = express.Router();

// PROTECTED ROUTE: Shorten URL - creates new short URL (requires authentication)
router.post('/shorten', async (req, res) => {
    try {
        // req.user is set by authenticationMiddleware
        console.log('Shorten route - req.user:', req.user);
        console.log('Shorten route - full req.user object:', JSON.stringify(req.user));

        if (!req.user) {
            console.error('req.user is undefined!');
            return res.status(401).json({ error: 'Authentication required - user not found' });
        }

        const userID = req.user.id || req.user.userId;

        if (!userID) {
            console.error('userID is undefined! req.user:', req.user);
            return res.status(401).json({ error: 'Authentication required - user ID not found' });
        }

        const validationResult = await shortenPostRequestBodySchema.safeParseAsync(req.body);
        if (!validationResult.success) {
            return res.status(400).json({ error: 'Invalid request data', details: validationResult.error.errors });
        }

        const { url, code } = validationResult.data;
        const shortcode = code ?? nanoid(6);

        const [result] = await db.insert(urlsTable).values({
            shortcode,
            targetURL: url,
            userID,
        }).returning({
            id: urlsTable.id,
            shortcode: urlsTable.shortcode,
            targetURL: urlsTable.targetURL,
            userID: urlsTable.userID,
        });

        res.status(201).json({
            id: result.id,
            shortcode: result.shortcode,
            targetURL: result.targetURL,
            userID: result.userID
        });
    } catch (error) {
        console.error('Error shortening URL:', error);
        res.status(500).json({ error: 'Failed to shorten URL', message: error.message });
    }
});

export default router;
