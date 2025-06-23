# --- STAGE 1: Build ---
FROM node:20 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and lock file
COPY package*.json ./
COPY prisma ./prisma
COPY tsconfig.json .        
COPY src ./src

# Install dependencies
RUN npm ci

# Copy all project files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the Next.js app
RUN npm run build

# --- STAGE 2: Run ---
FROM node:20

WORKDIR /app

# Copy only the built output + node_modules
COPY --from=builder /app ./

# Expose Next.js default port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]
