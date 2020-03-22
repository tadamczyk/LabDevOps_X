const redis = require("redis");
const express = require("express");

const app = express();
const client = redis.createClient({
	host: 'my-redis-server',
	port: 6379
});

app.get('/', (req, res) => {
	res.send("Hello from my web app!");
});

app.listen(8080, () => {
	console.log("Listen on port 8080");
});
