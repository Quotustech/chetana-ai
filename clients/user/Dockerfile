FROM node:19 AS Production

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install 

COPY . .
RUN npm run build


EXPOSE 3000


CMD ["sh", "-c", "npm run start"]