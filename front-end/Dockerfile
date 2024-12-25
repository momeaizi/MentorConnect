FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm i --force

COPY . .

EXPOSE 3000

# RUN npm run build

CMD ["npm", "run", "dev"]