# Cryptocurrency Information and News API

## Overview

This documentation provides a detailed overview of a Node.js Express server that fetches and serves cryptocurrency information and news. The server uses the CoinGecko API to retrieve data about Ethereum and caches the results to improve performance and reduce API call frequency.

## Table of Contents

1. Introduction
2. Setup and Installation
3. API Endpoints
   - /info
   - /news
4. Caching Mechanism
5. Error Handling
6. Running the Server

## 1. Introduction

The server provides two main endpoints:
- /info: Fetches and returns detailed information about Ethereum, including current price, market cap, total volume, daily highs and lows, and historical data for the past 30 days.
- /news: Fetches and returns the latest cryptocurrency news.

The server uses caching to store the results of API calls for a specified duration, reducing the number of requests made to the CoinGecko API and improving response times.

## 2. Setup and Installation

### Prerequisites

- Node.js (v12 or higher)
- npm (Node Package Manager)

### Installation

1. Clone the repository or download the source code.
2. Navigate to the project directory.
3. Install the required dependencies:

```
npm install
```

4. Create a .env file in the root directory and specify the port (optional):

PORT=3000

5. Start the server:

node server.js

## 3. API Endpoints

### /info

#### Description

Fetches detailed information about Ethereum, including current price, market cap, total volume, daily highs and lows, and historical data for the past 30 days.

#### Method

GET

#### Response

```
{
  "crypto": {
    "currentPrice": 2500,
    "marketCap": 300000000,
    "totalVolume": 1000000,
    "dailyMax": 2600,
    "dailyMin": 2400
  },
  "capitalization": {
    "btc": 45,
    "eth": 20
  },
  "prices": [2500, 2550, 2600, ...],
  "marketCaps": [300000000, 310000000, 320000000, ...],
  "totalVolumes": [1000000, 1100000, 1200000, ...],
  "dates": ["6/1/2024", "6/2/2024", "6/3/2024", ...]
}
```

### /news

#### Description

Fetches the latest cryptocurrency news.

#### Method

GET

#### Response

```
[
  {
    "title": "Latest Crypto News",
    "description": "Description of the news",
    "url": "https://example.com/news/1"
  },
  ...
]
```

## 4. Caching Mechanism

The server uses in-memory caching to store the results of API calls for a specified duration. This reduces the number of requests made to the CoinGecko API and improves response times.

### Cache Duration

- /info: 1 minute
- /news: 3 minutes

### Cache Structure

```
let infoCache = {
  data: null,
  timestamp: null,
};

let newsCache = {
  data: null,
  timestamp: null,
};
```

### Cache Validation

Before making an API call, the server checks if the cached data is still valid based on the cache duration. If the data is valid, it returns the cached data. Otherwise, it fetches new data from the API and updates the cache.

## 5. Error Handling

The server includes error handling to manage issues that may arise during API calls. If an error occurs, the server logs the error and returns a 500 status code with an appropriate error message.

### Example

```
catch (error) {
  console.error(
    "Error fetching info:",
    error?.response?.statusText || error.message,
  );
  res.status(500).send(
    error?.response?.statusText || "Error fetching info",
  );
}
```

## 6. Running the Server

To run the server, use the following command:

node server.js

The server will start and listen on the port specified in the .env file or default to port 3000 if no port is specified.

### Example Output

Server is running on port 3000

This documentation provides a comprehensive overview of the Cryptocurrency Information and News API, detailing its setup, endpoints, caching mechanism, error handling, and how to run the server. The API leverages the CoinGecko API to provide up-to-date information and news about Ethereum, ensuring efficient and reliable data retrieval through caching.
