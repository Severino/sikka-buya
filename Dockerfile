# syntax=docker/dockerfile:1
FROM node:16-alpine

WORKDIR /app

RUN mkdir frontend
RUN mkdir backend
RUN mkdir test

COPY package*.json ./
COPY frontend/package*.json /frontend/
COPY backend/package*.json /backend/
COPY test/package*.json /test/

RUN yarn global add @vue/cli
RUN yarn add global grunt-cli
RUN npm install -g http-server

RUN yarn install

COPY . /app

WORKDIR /app/frontend
RUN yarn install
RUN yarn build

EXPOSE 8080
CMD [ "http-server", "dist" ]
