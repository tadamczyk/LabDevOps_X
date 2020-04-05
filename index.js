const redis = require("redis");
const express = require("express");
const process = require("process");

const app = express();
const client = redis.createClient({
    host: "my-redis-server",
    port: 6379
});

client.set("counter", 0);

app.get("/", (req, res) => {
    process.exit(0);

    client.get("counter", (err, counterValue) => {
	    res.send("Counter: " + counterValue);
	    client.set("counter", parseInt(counterValue) + 1);
    });
});

function nwd(a, b) {
	var tmp;

	if (a < b) {
		tmp = a;
		a = b;
		b = tmp;
	}

	while (b) {
		tmp = a % b;
		a = b;
		b = tmp;
	}
	
	return a;
}

app.get("/nwd/:number1/:number2", (req, res) => {
	const number1 = req.params.number1;
	const number2 = req.params.number2;
	const key = "NWD(" + number1 + ", " + number2 + ")";

	client.get(key, (err, value) => {
		if (value === null || value === undefined) {
			value = nwd(number1, number2);
			client.set(key, parseInt(value));
		}

		res.send(key + " = " + value);
	});
});

app.listen(8080, () => {
    console.log("Listen on port 8080");
});

