# Stage 1: Builder
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies including devDependencies (needed for Prisma)
RUN npm ci

# Copy Prisma schema
COPY prisma ./prisma/

# Generate Prisma Client
# This will generate the client into src/generated/prisma as specified in schema.prisma
RUN npx prisma generate

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Runner
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application
COPY --from=builder /app/dist ./dist

# Copy the generated Prisma client
# Since output="src/generated/prisma", we need to copy it to the same relative path in dist
# or wherever the compiled code expects it.
# The code in dist/server.js (compiled from src/server.ts) will try to import from ../generated/prisma
COPY --from=builder /app/src/generated/prisma ./dist/generated/prisma

# Use non-root user
USER node

EXPOSE 8080

CMD ["node", "dist/server.js"]
