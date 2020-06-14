FROM node:alpine AS build
WORKDIR /opt/app
COPY package.json .
RUN npm install
COPY . .
RUN npm run-script build

FROM nginx
COPY --from=build /opt/app/build /usr/share/nginx/html