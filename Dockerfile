FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install
RUN npm install --save-dev @types/node

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

ENV MAVLINK_HOST=ardupilot
ENV MAVLINK_PORT=14550

CMD ["npm", "start"]
