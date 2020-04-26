const keys = require("./keys");

const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const redis = require("redis");
const { Pool } = require("pg");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const postgresClient = new Pool({
  host: keys.pgHost,
  port: keys.pgPort,
  user: keys.pgUser,
  password: keys.pgPassword,
  database: keys.pgDatabase
});

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});

const port = 4000;

/********************************/

postgresClient
  .on("error", () => console.log("Cannot connect to PostgreSQL database."));

postgresClient
  .query("CREATE TABLE IF NOT EXISTS leap_years (date DATE, next_leap_year INT);")
  .catch(error => console.log(error));

app
  .get("/", (request, response) => {
    response.send("Multi container app - backend");
  });

function isLeapYear(year) {
  return new Date(year, 1, 29).getDate() === 29;
}

app
  .get("/leapYear/:year", (request, response) => {
    var year = request.params.year;

    redisClient
      .get(year, (error, isLeap) => {
        if (isLeap === null || isLeap === undefined) {
          isLeap = isLeapYear(year);
          redisClient
            .set(year, parseInt(isLeap));
        }

        response
          .send(`Year ${year} is ${isLeap ? "leap" : "not leap"}.`);
      });
  });

function getNextLeapYear(date) {
  var dateParts = date.split("-");
  var myDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
  var year = myDate.getFullYear();
  var isLeap = isLeapYear(year);

  if (isLeap === true && myDate.getMonth() > 1) {
    return year + 4;
  }

  while (isLeapYear(year) === false) {
    year = year + 1;
    isLeap = isLeapYear(year);
  }

  return year;
};

app
  .get("/leapYear/next/:date", (request, response) => {
    var date = request.params.date;

    redisClient
      .get(date, (error, nextLeapYear) => {
        if (nextLeapYear === null || nextLeapYear === undefined) {
          nextLeapYear = getNextLeapYear(date);
          redisClient
            .set(date, parseInt(nextLeapYear));

          postgresClient
            .query("INSERT INTO leap_years (date, next_leap_year) VALUES ($1, $2);", [date, nextLeapYear])
            .catch(error => console.log(error));
        }

        response
          .send(`Next leap year for ${date} is ${nextLeapYear}.`);
      });
  });

app
  .get("/leapYear/next/all/results", (request, response) => {
    postgresClient
      .query("SELECT date, next_leap_year FROM leap_years;", (error, results) => {
        if (error) {
          throw error;
        }

        response
          .status(200)
          .json(results.rows);
      });
  });

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  console.log(`pgHost: ${keys.pgHost}`);
  console.log(`pgPort: ${keys.pgPort}`);
  console.log(`pgDatabase: ${keys.pgDatabase}`);
  console.log(`pgUser: "${keys.pgUser}`);
  console.log(`redisHost: ${keys.redisHost}`);
  console.log(`redisPort: ${keys.redisPort}`);
});