module.exports = {
  port: process.env.PORT,
  pgHost: process.env.PG_HOST,
  pgPort: process.env.PG_PORT,
  pgUser: process.env.PG_USER,
  pgDatabase: process.env.PG_DATABASE,
  pgPassword: process.env.PG_PASSWORD.trim(),
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
}