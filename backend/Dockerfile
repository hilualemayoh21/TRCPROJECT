FROM node:20-bookworm-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN apt-get update && apt-get install -y openssl ca-certificates
COPY prisma ./prisma
RUN npm install

COPY . .
RUN npm run build

FROM node:20-bookworm-slim

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/swagger.yaml ./dist/swagger.yaml

EXPOSE 4000

CMD ["npm", "run", "start"]
