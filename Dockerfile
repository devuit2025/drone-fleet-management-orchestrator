FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install
RUN npm install --save-dev @types/node

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# ENV MAVLINK_HOST=ardupilot
# ENV MAVLINK_PORT=14550

CMD ["npm", "start"]



# # Stage 1: build
# FROM node:20-alpine AS builder
# WORKDIR /app

# # Install dependencies
# COPY package*.json ./
# RUN npm install

# # Copy source and build
# COPY tsconfig.json ./
# COPY src ./src
# RUN npm run build

# # Stage 2: production image
# FROM node:20-alpine
# WORKDIR /app

# # Copy only built files from builder
# COPY --from=builder /app/dist ./dist
# COPY package*.json ./

# # Install only production dependencies
# RUN npm install --production

# CMD ["node", "dist/index.js"]
