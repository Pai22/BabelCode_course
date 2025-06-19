FROM node:21.7-alpine3.18 AS builder

WORKDIR /app
COPY . . /app/

RUN npm ci && npm run build

FROM nginx:1.25.4-alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
CMD [ "nginx", "-g", "daemon off;" ]