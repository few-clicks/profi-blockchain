const express = require("express");
const axios = require("axios");
require("dotenv").config();
const cors = require("cors");

const app = express();

const corsOptions = {
	origin: "*",
};
app.use(cors(corsOptions));

const API_ENDPOINTS = {
	crypto: "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum",
	capitalization: "https://api.coingecko.com/api/v3/global",
	chart: "https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=30&interval=daily",
};

let infoCache = {
	data: null,
	timestamp: null,
};
app.get("/info", async (_, res) => {
	try {
		const currentTime = new Date().getTime();
		const cacheDuration = 1 * 60 * 1000;

		if (
			infoCache.data &&
			currentTime - infoCache.timestamp < cacheDuration
		) {
			console.log("[INFO] from cache");
			return res.json(infoCache.data);
		} else {
			const dataResponses = await Promise.all(
				Object.entries(API_ENDPOINTS).map(([key, url]) =>
					axios
						.get(url)
						.then((response) => ({ key, data: response.data })),
				),
			);

			const result = dataResponses.reduce((acc, { key, data }) => {
				if (key === "chart") {
					acc["prices"] = data?.prices.map((el) => el[1]);
					acc["marketCaps"] = data?.market_caps.map((el) => el[1]);
					acc["totalVolumes"] = data?.total_volumes.map(
						(el) => el[1],
					);
					acc["dates"] = data?.prices.map((el) => {
						const date = new Date(el[0]);
						const year = date.getFullYear();
						const month = date.getMonth() + 1;
						const day = date.getDate();
						return `${month}/${day}/${year}`;
					});
				} else if (key === "capitalization") {
					acc[key] = data?.data?.market_cap_percentage;
				} else {
					acc[key] = {
						currentPrice: data.at(0)?.current_price,
						marketCap: data?.at(0)?.market_cap,
						totalVolume: data?.at(0)?.total_volume,
						dailyMax: data?.at(0)?.high_24h,
						dailyMin: data?.at(0)?.low_24h,
					};
				}
				return acc;
			}, {});

			infoCache.data = result;
			infoCache.timestamp = currentTime;

			console.log("[INFO] from api");
			res.json(result);
		}
	} catch (error) {
		console.error(
			"Error fetching info:",
			error?.response?.statusText || error.message,
		);
		res.status(500).send(
			error?.response?.statusText || "Error fetching info",
		);
	}
});

let newsCache = {
	data: null,
	timestamp: null,
};
app.get("/news", cors(corsOptions), async (_, res) => {
	try {
		const currentTime = new Date().getTime();
		const cacheDuration = 3 * 60 * 1000;

		if (
			newsCache.data &&
			currentTime - newsCache.timestamp < cacheDuration
		) {
			console.log("[NEWS] from cache");
			return res.json(newsCache.data);
		} else {
			console.log("[NEWS] from api");
			const response = await axios.get(
				"https://api.coingecko.com/api/v3/news",
			);

			newsCache.data = response.data;
			newsCache.timestamp = currentTime;

			return res.json(response.data);
		}
	} catch (error) {
		console.error(
			"Error fetching info:",
			error?.response?.statusText || error.message,
		);
		res.status(500).send("Error fetching info");
	}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
