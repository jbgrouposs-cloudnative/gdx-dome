FROM node:10 AS build
LABEL maintainer="J34365"

WORKDIR /tmp/build

ENV VUE_APP_SERVER_URI=wahfoo

COPY ./package.json .
COPY ./package-lock.json .
COPY ./babel.config.json .
COPY ./src ./src
COPY ./public ./public

RUN set -x && \
    npm i && \
    npm run build

FROM nginx:latest

COPY --from=build /tmp/build/dist /usr/share/nginx/html
