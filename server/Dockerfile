FROM oven/bun:1 as build

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install

COPY --chown=bun:bun . .
RUN bun build

FROM oven/bun:1 as dependencies

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --production

FROM oven/bun:1

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
