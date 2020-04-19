#!/bin/sh

docker stop my-backend my-postgres my-redis
docker rmi my-backend
docker network rm multi-container-app