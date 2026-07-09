FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY client/package.json client/package.json
COPY server/package.json server/package.json
COPY shared/package.json shared/package.json

RUN npm ci

COPY . .

RUN npm run build

FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
COPY client/package.json client/package.json
COPY server/package.json server/package.json
COPY shared/package.json shared/package.json

RUN npm ci --omit=dev

COPY --from=builder /app/client/dist client/dist
COPY --from=builder /app/server/dist server/dist
COPY --from=builder /app/shared/dist shared/dist
COPY data.json data.json

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || 3000) + '/health').then((response) => process.exit(response.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["npm", "run", "start", "-w", "server"]
