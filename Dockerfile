FROM node:20-alpine

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy source 
COPY ./src ./src
COPY tsconfig.json .

# Build TypeScript
RUN npm run build

# Expose UDP port(s) for MAVLink
EXPOSE 14550/udp

CMD ["node", "dist/index.js"]

