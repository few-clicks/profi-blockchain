const express = require("express");
const axios = require("axios");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(cors());

const API_ENDPOINTS = {
	crypto: "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum",
	capitalization: "https://api.coingecko.com/api/v3/global",
	chart: "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30&interval=daily",
};

app.get("/info", async (_, res) => {
	try {
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
				acc["totalVolumes"] = data?.total_volumes.map((el) => el[1]);
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

		res.json(result);
	} catch (error) {
		console.error("Error fetching info:", error?.response?.statusText);
		res.status(500).send(error?.response?.statusText);
	}
});

app.get("/news", async (_, res) => {
	try {
		const response = await axios.get(
			"https://api.coingecko.com/api/v3/news",
		);

		res.json(response.data);
	} catch (error) {
		console.error("Error fetching info:", error);
		res.status(500).send("Error fetching info");
	}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
