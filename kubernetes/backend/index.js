const express = require("express");
const redis = require("redis");
const { v4: uuidv4 } = require("uuid");
const { Pool } = require("pg");

const app = express();
const appId = uuidv4();
const port = 5000;

const postgresClient = new Pool({
  host: "my-postgres-service",
  port: 5432,
  user: "postgres",
  password: "pgpassword123",
  database: "postgres"
});

const redisClient = redis.createClient({
  host: "my-redis-service",
  port: 6379,
  retry_strategy: () => 1000
});

postgresClient
  .on("error", () => console.log("Cannot connect to PostgreSQL database."));

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

app.listen(port, error => {
  console.log(`Listening on port ${port}`);
});