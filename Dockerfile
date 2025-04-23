FROM node:23-slim AS builder

ARG VITE_SPOTIFY_TOKEN
ENV VITE_SPOTIFY_TOKEN=$VITE_SPOTIFY_TOKEN

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:23-slim
RUN npm install -g serve
WORKDIR /app
COPY --from=builder /app/dist .

EXPOSE 3000
CMD ["serve", "-s", ".", "-l", "tcp://0.0.0.0:3000"]
