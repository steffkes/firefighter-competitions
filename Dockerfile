FROM node:23.4.0-bookworm AS base

WORKDIR /app

# --

FROM base AS production-builder

RUN mkdir /build
WORKDIR /build

COPY . ./

RUN npm install && \
    npm run build

# --

FROM base AS production

COPY --from=production-builder /build/.output ./
COPY --from=production-builder /build/data ./data

CMD ["node", "server/index.mjs"]
