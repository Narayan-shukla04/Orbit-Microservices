# Stage 1: Base dependencies
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Stage 2: Development (used by docker-compose)
FROM base AS dev
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Stage 3: Build production assets
FROM base AS builder
ARG VITE_API_URL
ARG VITE_SOCKET_URL
ARG VITE_FRIENDS_SOCKET_URL
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_SOCKET_URL=${VITE_SOCKET_URL}
ENV VITE_FRIENDS_SOCKET_URL=${VITE_FRIENDS_SOCKET_URL}
RUN npm run build

# Stage 4: Production web server (default target for Cloud Run / production)
FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
