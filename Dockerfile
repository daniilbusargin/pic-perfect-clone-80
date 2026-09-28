# Production image for Yandex Cloud Serverless Containers (or any Docker host).
# Nitro builds a self-contained Node server into .output, so the runtime image
# needs no node_modules.

FROM oven/bun:1 AS build
WORKDIR /app
COPY package.json bun.lock bunfig.toml ./
RUN bun install --frozen-lockfile
COPY . .
# The Lovable config targets Cloudflare by default; build a plain Node server instead.
ENV NITRO_PRESET=node-server
RUN bun run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=8080
COPY --from=build /app/.output ./.output
USER node
EXPOSE 8080
# Serverless Containers injects PORT at runtime; the server reads it.
CMD ["node", ".output/server/index.mjs"]
