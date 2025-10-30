# syntax=docker/dockerfile:1

# Base image
FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies (including dev) for building
FROM base AS deps
COPY package*.json ./
# Cache npm directory to speed up installs
RUN --mount=type=cache,target=/root/.npm npm ci

# Build the NestJS application
FROM deps AS build
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src ./src
RUN npm run build

# Production image with only prod deps and compiled dist
FROM base AS prod
ENV NODE_ENV=production
# Install only production dependencies
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev
# Copy compiled sources
COPY --from=build /app/dist ./dist
# Ensure uploads directory exists for static assets
RUN mkdir -p /app/uploads
EXPOSE 3000
CMD ["node", "dist/main.js"]
