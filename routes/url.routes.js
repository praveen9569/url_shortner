import express from 'express';
import { shortenPostRequestBodySchema } from '../validation/request.validation.js';
import { db } from '../db/index.js';
import { urlsTable } from '../models/index.js';
import { nanoid } from 'nanoid';
import { eq } from 'drizzle-orm';

const router = express.Router();

// PUBLIC ROUTE: Redirect route - handles short URL redirection (no auth required)
router.get('/short/:shortcode', async (req, res) => {
  try {
    const { shortcode } = req.params;

    const [urlRecord] = await db
      .select()
      .from(urlsTable)
      .where(eq(urlsTable.shortcode, shortcode))
      .limit(1);

    if (!urlRecord) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    // Record click asynchronously (don't wait for it to complete)
    const clickMetadata = {
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent'),
      referer: req.get('referer') || req.get('referrer'),
    };

    // Import recordClick dynamically
    import('../services/analytics.service.js')
      .then(({ recordClick }) => recordClick(shortcode, clickMetadata))
      .catch(err => console.error('Error recording click:', err));

    // Redirect to the original URL immediately
    res.redirect(urlRecord.targetURL);
  } catch (error) {
    console.error('Error redirecting:', error);
    res.status(500).json({ error: 'Failed to redirect' });
  }
});

export default router;
