const UrlService = require('../services/url.service');

async function handleGenerateNewShortUrl(req, res) {
    const body = req.body;
    if (!body.url) {
        return res.status(400).json({ error: 'URL is required' });
    }
    
    // Support future custom aliases if provided in the body
    const customAlias = body.customAlias || null;

    try {
        const shortId = await UrlService.generateShortUrl(body.url, customAlias);
        return res.status(201).json({ id: shortId });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    try {
        const analytics = await UrlService.getAnalytics(shortId);
        return res.json(analytics);
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
}

async function handleRedirectToOriginalUrl(req, res) {
    const shortId = req.params.shortId;
    try {
        const redirectURL = await UrlService.getUrlAndRecordVisit(shortId);
        if (redirectURL) {
            return res.redirect(redirectURL);
        } else {
            return res.status(404).json({ error: 'URL not found' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Server Error' });
    }
}

module.exports = {
    handleGenerateNewShortUrl,
    handleGetAnalytics,
    handleRedirectToOriginalUrl,
};