# Docker commands

`docker version` -> show installed docker version  
`docker stats` -> show stats of running containers  
`docker logs CONTAINER` -> show the logs of a container  
`docker images` -> show a list of all images  
`docker pull IMAGE[:TAG]` -> download an image  
`docker push IMAGE[:TAG]` -> upload an image to repository  
`docker build -t IMAGE[:TAG] DIR` -> build and tag an image from Dockerfile  
`docker tag IMAGE NEWIMAGE` -> tag an image  
`docker rmi IMAGE` -> delete an image  
`docker image prune` -> delete dangling images  
`docker image prune -a ` -> delete all unused images  
`docker save IMAGE > FILE` -> save an image to a file  
`docker load -i FILE` -> load an image from a file  
`docker ps` -> show a list of running containers  
`docker ps -a` -> show a list of all containers  
`docker run IMAGE` -> start a new container from an image  
`docker run --name CONTAINER IMAGE` -> start a new container with passed name from an image  
`docker run -p HOSTPORT:CONTAINERPORT IMAGE` -> start a new container from an image and map a port  
`docker run -d IMAGE` -> start a new container from an image in a background  
`docker run -v HOSTDIR:TARETDIR IMAGE` -> start a new container from an image and map a local directory into the container  
`docker run -it IMAGE CMD` -> start a new container from an image and run a command  
`docker rm CONTAINER` -> delete a container  
`docker rm -f CONTAINER` -> delete a running container  
`docker container prune` -> delete stopped containers  
`docker stop CONTAINER` -> stop container  
`docker start CONTAINER` -> start container  
`docker cp CONTAINER:SOURCE TARGET` -> copy a file from a container to the host  
`docker cp TARGET CONTAINER:SOURCE` -> copy a file from the host to a container  
`docker exec -it CONTAINER CMD` -> start a command inside a running container  
`docker rename OLD NEW` -> rename a container  
`docker commit CONTAINER` -> create an image out of container