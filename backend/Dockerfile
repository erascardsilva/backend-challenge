###  Erasmo Cardoso
# Node.js 
FROM node:16-alpine

RUN apk add --no-cache python3 make g++ bash

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

# App
CMD ["npm", "start"]
