const { nanoid } = require('nanoid');
const URL = require('../models/url');

class UrlService {
    /**
     * Generates a new short URL, accepting an optional custom alias.
     */
    async generateShortUrl(redirectURL, customAlias = null) {
        if (!redirectURL) {
            throw new Error('redirectURL is required');
        }

        let shortId = customAlias;

        if (shortId) {
            // Check if custom alias is already taken
            const existingUrl = await URL.findOne({ shortId });
            if (existingUrl) {
                throw new Error('Custom alias is already in use');
            }
        } else {
            // Generate a random 8-character ID
            shortId = nanoid(8);
        }

        await URL.create({
            shortId: shortId,
            redirectURL: redirectURL,
            visitHistory: [],
        });

        return shortId;
    }

    /**
     * Retrieves the original URL and pushes a new visit timestamp.
     */
    async getUrlAndRecordVisit(shortId) {
        const entry = await URL.findOneAndUpdate(
            { shortId },
            {
                $push: {
                    visitHistory: { timestamp: Date.now() },
                },
            },
            { new: true }
        );

        return entry ? entry.redirectURL : null;
    }

    /**
     * Retrieves analytics for a short URL.
     */
    async getAnalytics(shortId) {
        const result = await URL.findOne({ shortId });
        if (!result) {
            throw new Error('URL not found');
        }

        return {
            totalClicks: result.visitHistory.length,
            analytics: result.visitHistory,
        };
    }
}

module.exports = new UrlService();
