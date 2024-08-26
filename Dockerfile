FROM node:20.12.0-alpine3.19

COPY . /app
RUN apk --no-cache add sqlite && mkdir /app/db && cd /app && npm i

ENV PORT=80

ENTRYPOINT ["/bin/sh", "-c", "cd /app && npm run build && npm run gen && node /app/server.js"]

