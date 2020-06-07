const keys = require("./keys");
const express = require("express");
const redis = require("redis");
const { Pool } = require("pg");
const { v4: uuidv4 } = require("uuid");

const app = express();
const appId = uuidv4();

const postgresClient = new Pool({
  host: keys.pgHost,
  port: keys.pgPort,
  user: keys.pgUser,
  database: keys.pgDatabase,
  password: keys.pgPassword
});

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});

postgresClient.on("error", () => console.log("Cannot connect to PostgreSQL database."));

postgresClient
  .query("CREATE TABLE IF NOT EXISTS CURRENT_APP_ID (id SERIAL, appId TEXT, activeFrom TIMESTAMPTZ NOT NULL, activeTo TIMESTAMPTZ NULL);")
  .catch(error => console.log(error));

app.get("/", (request, response) => {
  response.send(`[${appId}] Hello from backend app!`);

  redisClient.get("currentAppId", (error, currentAppId) => {
    if (currentAppId !== appId) {
      const now = new Date();

      postgresClient
        .query("UPDATE CURRENT_APP_ID SET activeTo = $1 WHERE id IN (SELECT MAX(id) FROM CURRENT_APP_ID);", [now])
        .catch(error => console.log(error));

      postgresClient
        .query("INSERT INTO CURRENT_APP_ID (appId, activeFrom, activeTo) VALUES ($1, $2, NULL);", [appId, now])
        .catch(error => console.log(error));
    }
  });

  redisClient.set("currentAppId", appId);
});

app.get("/appId", (request, response) => {
  postgresClient
    .query("SELECT id, appId, activeFrom, activeTo FROM CURRENT_APP_ID;", (error, results) => {
      if (error) {
        throw error;
      }

      response.status(200).json(results.rows);
    });
});

app.listen(keys.port, error => {
  console.log(`Listening on port: ${keys.port}`);
  console.log(`PostgreSQL host: ${keys.pgHost}`);
  console.log(`PostgreSQL port: ${keys.pgPort}`);
  console.log(`PostgreSQL user: ${keys.pgUser}`);
  console.log(`PostgreSQL database: ${keys.pgDatabase}`);
  console.log(`Redis host: ${keys.redisHost}`);
  console.log(`Redis port: ${keys.redisPort}`);
});