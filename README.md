# Production-Ready URL Shortener

A robust, "SOLID", production-ready URL shortener built with Node.js, Express, and MongoDB.

## Features
- **Fast and Secure**: Powered by Express and nanoid for safe, fast short-ID generation.
- **Custom Aliases**: Internally supports passing your own custom URL aliases.
- **Analytics Tracking**: Tracks total clicks and full visit history (with timestamps) for every generated URL.
- **Clean Architecture**: Built with SOLID principles, splitting concerns into Routes, Controllers, and Services.
- **Configurable**: Environment variable support for easy deployments.

## Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** Redis (blazing fast key-value store)
- **Utilities:** `nanoid` (for short ID generation), `dotenv` (for environment configuration)

## API Endpoints

### 1. Create Short URL
- **Endpoint:** `POST /url`
- **Body:**
  ```json
  {
      "url": "https://example.com/very/long/url",
      "customAlias": "my-alias" // (Optional)
  }
  ```
- **Response:** `201 Created`
  ```json
  {
      "id": "my-alias"
  }
  ```

### 2. Redirect to Original URL
- **Endpoint:** `GET /:shortId`
- **Description:** Redirects the user's browser to the original mapped URL. 

### 3. Get URL Analytics
- **Endpoint:** `GET /url/analytics/:shortId`
- **Response:** `200 OK`
  ```json
  {
      "totalClicks": 12,
      "analytics": [
          {
              "timestamp": 1698765432100,
              "_id": "65e8a7fc8db2a..."
          }
      ]
  }
  ```

## Setup and Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Prashantraj11/urlShortner.git
   cd urlShortner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Ensure you have a `.env` file in the root directory:
   ```env
   PORT=8000
   UPSTASH_REDIS_REST_URL=https://skilled-bird-79832.upstash.io
   UPSTASH_REDIS_REST_TOKEN=your_upstash_token
   ```

4. **Start the application**
   ```bash
   npm start
   ```

## Future Roadmap
- Develop a premium UI/Frontend for public usage.
- Enhance analytics visualization.
