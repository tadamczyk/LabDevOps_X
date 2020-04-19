const keys = require("./keys");

const express = require("express");
const redis = require("redis");
const { Pool } = require("pg");

const app = express();

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort
});

redisClient.set("counter", 0);

const postgresClient = new Pool({
  host: keys.pgHost,
  port: keys.pgPort,
  user: keys.pgUser,
  password: keys.pgPassword,
  database: keys.pgDatabase
});

postgresClient.query("CREATE TABLE IF NOT EXISTS results (number INT)")
  .catch(error => console.log(error));

app.get("/", (request, response) => {
  response.send("Multi container app - backend");
});

app.get("/counter", (request, response) => {
  redisClient.get("counter", (err, counterValue) => {
    response.send("Counter: " + counterValue);
    redisClient.set("counter", parseInt(counterValue) + 1);
  });
});

function nwd(a, b) {
  var temp;

  while (b) {
    temp = a % b;
    a = b;
    b = temp;
  }

  return a;
};

app.get("/nwd/:number1/:number2", (request, response) => {
  var number1 = request.params.number1;
  var number2 = request.params.number2;

  if (number1 < number2) {
    var temp = number1;
    number1 = number2;
    number2 = temp;
  }

  const key = "[" + number1 + "," + number2 + "]";

  redisClient.get(key, (err, value) => {
    if (value === null || value === undefined) {
      value = nwd(number1, number2);
      redisClient.set(key, parseInt(value));
      postgresClient.query("INSERT INTO results (number) VALUES ($1)", [value])
        .catch(error => console.log(error));
    }

    response.send("NWD" + key + " = " + value);
  });
});

app.get("/nwd/results", (request, response) => {
  postgresClient.query("SELECT number FROM results", (error, results) => {
    if (error) {
      throw error;
    }

    response.status(200).json(results.rows);
  });
});

app.listen(8080, () => {
  console.log("Listening on port 8080");
  console.log("pgHost: " + keys.pgHost);
  console.log("pgPort: " + keys.pgPort);
  console.log("pgDatabase: " + keys.pgDatabase);
  console.log("pgUser: " + keys.pgUser);
  console.log("redisHost: " + keys.redisHost);
  console.log("redisPort: " + keys.redisPort);
});