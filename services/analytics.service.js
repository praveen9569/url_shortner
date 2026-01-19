import { db } from '../db/index.js';
import { urlsTable, clicksTable } from '../models/index.js';
import { eq, and, count, desc, sql } from 'drizzle-orm';

/**
 * Get overview statistics for a user's dashboard
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Overview stats including total clicks, active links, etc.
 */
export async function getOverviewStats(userId) {
    // Get total clicks across all user's URLs
    const clicksResult = await db
        .select({ totalClicks: sql`COALESCE(SUM(${urlsTable.clicks}), 0)` })
        .from(urlsTable)
        .where(eq(urlsTable.userID, userId));

    const totalClicks = Number(clicksResult[0]?.totalClicks || 0);

    // Get active links count
    const activeLinksResult = await db
        .select({ count: count() })
        .from(urlsTable)
        .where(eq(urlsTable.userID, userId));

    const activeLinks = activeLinksResult[0]?.count || 0;

    // Get top location (most common country from recent clicks)
    const topLocationResult = await db
        .select({
            country: clicksTable.country,
            clickCount: count()
        })
        .from(clicksTable)
        .innerJoin(urlsTable, eq(clicksTable.urlId, urlsTable.id))
        .where(eq(urlsTable.userID, userId))
        .groupBy(clicksTable.country)
        .orderBy(desc(count()))
        .limit(1);

    const topLocation = topLocationResult[0] || { country: 'Unknown', clickCount: 0 };

    // Calculate percentage of total traffic
    const topLocationPercentage = totalClicks > 0
        ? Math.round((topLocation.clickCount / totalClicks) * 100)
        : 0;

    return {
        totalClicks,
        activeLinks,
        topLocation: {
            country: topLocation.country || 'Unknown',
            percentage: topLocationPercentage
        }
    };
}

/**
 * Get all URLs for a user with their statistics
 * @param {string} userId - User ID
 * @returns {Promise<Array>} List of URLs with stats
 */
export async function getUserUrls(userId) {
    const urls = await db
        .select({
            id: urlsTable.id,
            shortcode: urlsTable.shortcode,
            targetURL: urlsTable.targetURL,
            clicks: urlsTable.clicks,
            lastClickedAt: urlsTable.lastClickedAt,
            createdAt: urlsTable.created_at,
        })
        .from(urlsTable)
        .where(eq(urlsTable.userID, userId))
        .orderBy(desc(urlsTable.created_at));

    return urls;
}

/**
 * Get detailed statistics for a specific URL
 * @param {string} shortcode - Short code of the URL
 * @param {string} userId - User ID (for authorization)
 * @returns {Promise<Object>} Detailed URL stats
 */
export async function getUrlStats(shortcode, userId) {
    // Get URL info
    const [urlInfo] = await db
        .select()
        .from(urlsTable)
        .where(and(
            eq(urlsTable.shortcode, shortcode),
            eq(urlsTable.userID, userId)
        ))
        .limit(1);

    if (!urlInfo) {
        return null;
    }

    // Get click history (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentClicks = await db
        .select()
        .from(clicksTable)
        .where(and(
            eq(clicksTable.urlId, urlInfo.id),
            sql`${clicksTable.clickedAt} >= ${thirtyDaysAgo}`
        ))
        .orderBy(desc(clicksTable.clickedAt));

    // Get top countries
    const topCountries = await db
        .select({
            country: clicksTable.country,
            clicks: count()
        })
        .from(clicksTable)
        .where(eq(clicksTable.urlId, urlInfo.id))
        .groupBy(clicksTable.country)
        .orderBy(desc(count()))
        .limit(5);

    return {
        ...urlInfo,
        recentClicks,
        topCountries
    };
}

/**
 * Record a click event
 * @param {string} shortcode - Short code of the URL
 * @param {Object} metadata - Click metadata (IP, user agent, etc.)
 * @returns {Promise<void>}
 */
export async function recordClick(shortcode, metadata = {}) {
    // Get URL ID
    const [urlInfo] = await db
        .select({ id: urlsTable.id })
        .from(urlsTable)
        .where(eq(urlsTable.shortcode, shortcode))
        .limit(1);

    if (!urlInfo) {
        throw new Error('URL not found');
    }

    // Insert click record
    await db.insert(clicksTable).values({
        urlId: urlInfo.id,
        ipAddress: metadata.ipAddress || null,
        userAgent: metadata.userAgent || null,
        referer: metadata.referer || null,
        country: metadata.country || null,
        city: metadata.city || null,
    });

    // Update URL clicks count and last clicked timestamp
    await db
        .update(urlsTable)
        .set({
            clicks: sql`${urlsTable.clicks} + 1`,
            lastClickedAt: new Date()
        })
        .where(eq(urlsTable.id, urlInfo.id));
}
