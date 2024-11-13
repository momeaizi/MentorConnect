FROM node:18-alpine

WORKDIR /front-end

COPY package*.json ./

RUN npm i

COPY . .

CMD ["npm", "run", "dev"]