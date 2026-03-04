# Stage 1: Build the frontend
FROM node:20-slim AS builder

WORKDIR /app

# Install build dependencies for better-sqlite3 (though only needed for backend, doing it here for simplicity)
RUN apt-get update && apt-get install -y python3 make g++ 

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Run the server
FROM node:20-slim

WORKDIR /app

# Install runtime dependencies for better-sqlite3
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
# Install only production dependencies
RUN npm install --omit=dev

# Copy the built frontend from builder stage
COPY --from=builder /app/dist ./dist

# Copy backend files
COPY server.ts ./
COPY src/db.ts ./src/db.ts
# Since we are using tsx to run the server in this simple setup
RUN npm install -g tsx

EXPOSE 3000

ENV NODE_ENV=production

CMD ["tsx", "server.ts"]
