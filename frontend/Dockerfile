# ---------- Build stage (tiny + fast) ----------
FROM oven/bun:1 AS build
WORKDIR /app

# 1) Cache deps
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# 2) Build app
COPY . .
# Vite picks VITE_* envs at build-time; provided via build args from compose
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
RUN bun run build  # -> dist/

# ---------- Run stage (serve static) ----------
FROM nginx:1.27-alpine AS run
WORKDIR /usr/share/nginx/html

# Copy build
COPY --from=build /app/dist ./

# Nginx config for SPA + /api proxy to Laravel nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
