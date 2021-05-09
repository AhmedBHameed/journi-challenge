FROM node:12.16.3-slim

WORKDIR /usr/journi/

COPY ./server/package*.json ./

RUN yarn

COPY ./server/ .

# RUN yarn build