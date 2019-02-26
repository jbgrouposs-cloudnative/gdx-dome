FROM node:10
LABEL maintainer="J34365"

ARG NPM_PROXY

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin
# optionally if you want to run npm global bin without specifying path

ENV AWS_ACCESS_KEY_ID=key_id
ENV AWS_SECRET_ACCESS_KEY=access_key
ENV AWS_DEFAULT_REGION=us-west-2
ENV NODE_EXPOSE_PORT=50050
ENV NODE_PROXY_HOST=
ENV NODE_PROXY_PORT=

WORKDIR /home/node

USER node

COPY ./package.json /home/node/package.json

RUN set -x && \
    npm config set proxy $NPM_PROXY && \
    npm config set https-proxy $NPM_PROXY && \
    npm i

# TODO: auto run.
COPY ./src /home/node/src/
ENTRYPOINT [ "node", "./src/app.js" ]
