FROM node:10 AS build
LABEL maintainer="J34365"

ARG NPM_PROXY=

WORKDIR /tmp/build

ENV VUE_APP_SERVER_URI=http://localhost:50050

COPY ./package.json .
COPY ./package-lock.json .
COPY ./babel.config.js .
COPY ./src ./src
COPY ./public ./public

RUN set -x && \
    npm config set proxy $NPM_PROXY && \
    npm config set https-proxy $NPM_PROXY && \
    npm i && \
    npm run build

FROM nginx:latest

COPY --from=build /tmp/build/dist /usr/share/nginx/html
