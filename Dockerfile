# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package manifests for efficient layer caching
COPY package.json package-lock.json* bun.lock* ./
RUN npm install

# Copy application sources
COPY . .

# Build client SPA and backend server bundles into dist/
RUN npm run build

# Production runtime stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install production dependencies only
COPY package.json package-lock.json* ./
RUN npm install --omit=dev && npm cache clean --force

# Copy compiled bundles and static assets
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

# Expose default HTTP port
EXPOSE 3000

# Use unprivileged node user
USER node

CMD ["node", "dist/server.cjs"]
