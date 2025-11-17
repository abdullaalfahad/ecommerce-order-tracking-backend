FROM node:18-alpine AS base
WORKDIR /app

COPY package*.json ./
RUN npm install --production=false

COPY tsconfig.json ./
COPY src ./src

FROM base AS build
RUN npm run build

FROM node:18-alpine AS prod
WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm install --production

COPY --from=build /app/dist ./dist

COPY .env .env

EXPOSE 4000

CMD ["node", "dist/server.js"]
