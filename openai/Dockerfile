FROM node:19 AS Production

ENV NODE_ENV=development

WORKDIR /app

# Install FFmpeg
RUN apt-get update && apt-get install -y ffmpeg

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

CMD ["npm", "run", "start"]
