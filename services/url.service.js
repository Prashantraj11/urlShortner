const { nanoid } = require('nanoid');
const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

class UrlService {
    async generateShortUrl(redirectURL, customAlias = null) {
        if (!redirectURL) {
            throw new Error('redirectURL is required');
        }

        let shortId = customAlias;

        if (shortId) {
            const exists = await redis.exists(`url:${shortId}`);
            if (exists) {
                throw new Error('Custom alias is already in use');
            }
        } else {
            shortId = nanoid(8);
            
            while (await redis.exists(`url:${shortId}`)) {
                shortId = nanoid(8);
            }
        }

        await redis.set(`url:${shortId}`, redirectURL);

        return shortId;
    }

    async getUrlAndRecordVisit(shortId) {
        const redirectURL = await redis.get(`url:${shortId}`);
        
        if (redirectURL) {
            await redis.rpush(`visits:${shortId}`, Date.now().toString());
        }

        return redirectURL;
    }

    async getAnalytics(shortId) {
        const exists = await redis.exists(`url:${shortId}`);
        if (!exists) {
            throw new Error('URL not found');
        }

        const visits = await redis.lrange(`visits:${shortId}`, 0, -1);
        
        const formattedAnalytics = (visits || []).map(ts => ({ timestamp: Number(ts) }));

        return {
            totalClicks: formattedAnalytics.length,
            analytics: formattedAnalytics,
        };
    }
}

module.exports = new UrlService();
