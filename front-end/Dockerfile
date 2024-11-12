FROM node:18-alpine

WORKDIR /front-end

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]