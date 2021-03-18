FROM node:15.6-alpine

RUN mkdir /app

WORKDIR /app

COPY package*.json /app/

RUN npm ci

COPY . /app

EXPOSE 8080

CMD [ "node", "server.js" ]" ]" ]
