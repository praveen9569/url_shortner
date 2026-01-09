import express from 'express';
import { shortenPostRequestBodySchema } from '../validation/request.validation.js';
import {db} from '../db/index.js';
import  {urlsTable} from '../models/index.js';
import {nanoid} from 'nanoid';
import { ensureAuthenticated } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/shorten', ensureAuthenticated, async (req, res) => {
  try {
    const userID = req.user.id;
    
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
    res.status(500).json({ error: 'Failed to shorten URL' });
  }
});

export default router;
