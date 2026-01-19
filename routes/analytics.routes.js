import express from 'express';
import { getOverviewStats, getUserUrls, getUrlStats } from '../services/analytics.service.js';

const router = express.Router();

// Get dashboard overview statistics
router.get('/overview', async (req, res) => {
    try {
        const userId = req.user.id;
        const stats = await getOverviewStats(userId);
        res.json(stats);
    } catch (error) {
        console.error('Error fetching overview stats:', error);
        res.status(500).json({ error: 'Failed to fetch overview statistics' });
    }
});

// Get all URLs for the user with statistics
router.get('/urls', async (req, res) => {
    try {
        const userId = req.user.id;
        const urls = await getUserUrls(userId);
        res.json(urls);
    } catch (error) {
        console.error('Error fetching user URLs:', error);
        res.status(500).json({ error: 'Failed to fetch URLs' });
    }
});

// Get detailed statistics for a specific URL
router.get('/url/:shortcode', async (req, res) => {
    try {
        const { shortcode } = req.params;
        const userId = req.user.id;

        const stats = await getUrlStats(shortcode, userId);

        if (!stats) {
            return res.status(404).json({ error: 'URL not found or unauthorized' });
        }

        res.json(stats);
    } catch (error) {
        console.error('Error fetching URL stats:', error);
        res.status(500).json({ error: 'Failed to fetch URL statistics' });
    }
});

export default router;
