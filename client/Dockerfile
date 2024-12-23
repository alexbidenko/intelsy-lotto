FROM oven/bun:1 AS dependencies

WORKDIR /app

COPY package.json bun.lockb ./

RUN pnpm install --frozen-lockfile

FROM oven/bun:1 AS build

ARG BITRIX_CLIENT_ID
ARG BASIC_AUTH_PASSWORD

ENV BITRIX_CLIENT_ID=$BITRIX_CLIENT_ID
ENV BASIC_AUTH_PASSWORD=$BASIC_AUTH_PASSWORD

WORKDIR /app

COPY . .
COPY --from=dependencies /app/node_modules ./node_modules

RUN pnpm build

FROM oven/bun:1 AS deploy

WORKDIR /app

COPY --from=build --chown=bun:bun /app/.output .

USER bun

CMD  ["bun", "run", "server/index.mjs"]
