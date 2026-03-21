require('dotenv').config();
const express = require('express');
const urlRoute = require('./routes/url');
const { handleRedirectToOriginalUrl } = require('./controllers/url');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/url', urlRoute);
app.get('/:shortId', handleRedirectToOriginalUrl);

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;