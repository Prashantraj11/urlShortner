require('dotenv').config();
const express = require('express');
const { connectToMongoDB } = require('./connect');
const urlRoute = require('./routes/url');
const { handleRedirectToOriginalUrl } = require('./controllers/url');

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to MongoDB
connectToMongoDB(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/url', urlRoute);

// Redirect Route
app.get('/:shortId', handleRedirectToOriginalUrl);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});