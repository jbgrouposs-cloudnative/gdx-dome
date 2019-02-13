FROM node:10
LABEL maintainer="J34365"

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin
# optionally if you want to run npm global bin without specifying path

ENV NODE_EXPOSE_PORT=50050

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
