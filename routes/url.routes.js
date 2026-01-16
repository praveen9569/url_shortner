import express from 'express';
import { shortenPostRequestBodySchema } from '../validation/request.validation.js';
import {db} from '../db/index.js';
import  {urlsTable} from '../models/index.js';
import { eq } from 'drizzle-orm';
import {nanoid} from 'nanoid';
import { ensureAuthenticated } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/short/:code', async (req, res) => {
  try {
    const { code } = req.params;

    const [record] = await db
      .select({ targetURL: urlsTable.targetURL })
      .from(urlsTable)
      .where(eq(urlsTable.shortcode, code))
      .limit(1);

    if (!record) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    return res.redirect(record.targetURL);
  } catch (error) {
    console.error('Error handling redirect:', error);
    return res.status(500).json({ error: 'Failed to redirect' });
  }
});

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
