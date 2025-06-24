# 1. Build Stage
FROM node:20-slim AS builder

WORKDIR /app

# Install dependencies & Prisma prerequisites
COPY package*.json ./
COPY prisma ./prisma
RUN apt-get update && apt-get install -y openssl
RUN npm install

COPY . .
RUN npm run build

# 2. Run Stage
FROM node:20-slim

WORKDIR /app
ENV NODE_ENV=production

# Install OpenSSL for Prisma runtime
RUN apt-get update && apt-get install -y openssl

COPY --from=builder /app ./
COPY .env .env

EXPOSE 3000
CMD ["npm", "start"]
