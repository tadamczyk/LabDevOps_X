const keys = require("./keys");

const express = require("express");
const redis = require("redis");
const { Pool } = require("pg");

const app = express();

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort
});

const pgClient = new Pool({
  host: keys.pgHost,
  port: keys.pgPort,
  user: keys.pgUser,
  password: keys.pgPassword,
  database: keys.pgDatabase
});

redisClient.set("counter", 0);

pgClient.query("CREATE TABLE IF NOT EXISTS results (number INT)").catch(error => console.log(error));

app.get("/", (req, res) => {
  redisClient.get("counter", (err, counterValue) => {
    res.send("Counter: " + counterValue);
    redisClient.set("counter", parseInt(counterValue) + 1);
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
};

app.get("/nwd/:number1/:number2", (req, res) => {
  const number1 = req.params.number1;
  const number2 = req.params.number2;
  const key = "NWD(" + number1 + ", " + number2 + ")";

  redisClient.get(key, (err, value) => {
    if (value === null || value === undefined) {
      value = nwd(number1, number2);
      redisClient.set(key, parseInt(value));
      pgClient.query("INSERT INTO results (number) VALUES ($1)", [value]).catch(error => console.log(error));
    }

    res.send(key + " = " + value);
  });
});

app.get("/nwd/results", (req, resp) => {
  const result = null;

  pgClient.query("SELECT number FROM results", (error, results) => {
    if (error) {
      throw error
    };

    resp.status(200).json(results.rows);
  });
});

app.listen(8080, () => {
  console.log("Listen on port 8080");
  console.log("pgHost: " + keys.pgHost);
  console.log("pgPort: " + keys.pgPort);
  console.log("redisHost: " + keys.redisHost);
  console.log("redisPort: " + keys.redisPort);
});