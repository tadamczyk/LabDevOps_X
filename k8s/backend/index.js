const redis = require("redis");
const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");

const appId = uuidv4();
const port = 5000;

const redisClient = redis.createClient({
	host: "my-redis-service",
	port: 6379,
	retry_strategy: () => 1000
});

app.get("/", (request, response) => {
	response.send(`[${appId}] Hello from backend app!`);
	redisClient.set("currentAppId", appId);
});

app.listen(port, error => {
	console.log(`Listening on port ${port}`);
});