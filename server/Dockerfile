FROM oven/bun:1-alpine AS build

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

FROM oven/bun:1-alpine AS dependencies

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile --production

FROM oven/bun:1-alpine

RUN apk add --no-cache tzdata
ENV TZ=Europe/Moscow

ENV NODE_ENV production

WORKDIR /app

COPY package.json bun.lockb ./
COPY --from=build --chown=bun:bun /app/dist ./dist
COPY --from=dependencies --chown=bun:bun /app/node_modules ./node_modules
COPY --chown=bun:bun .env* ./

USER bun

CMD ["bun", "run", "start:prod"]
