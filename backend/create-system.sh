#!/bin/sh

docker network create multi-container-app
docker build -f Dockerfile.dev -t my-backend .
docker run --name my-postgres --rm -e POSTGRES_PASSWORD=1qaz2wsx --network multi-container-app -d postgres
docker run --name my-redis --rm --network multi-container-app -d redis
docker run --name my-backend --rm -e REDIS_HOST=my-redis -e REDIS_PORT=6379 -e PG_HOST=my-postgres -e PG_USER=postgres -e PG_PASSWORD=1qaz2wsx -e PG_PORT=5432 -e PG_DATABASE=postgres --network multi-container-app -p 8080:8080 my-backend