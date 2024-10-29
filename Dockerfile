FROM node:18.18.2-alpine AS base
WORKDIR /app

FROM base AS prod-deps
ARG NODE_ENV
COPY package*.json ./
RUN if [ "$NODE_ENV" = "development" ]; \
    then npm install; \
    else npm install --only=production; \
    fi
COPY ./ ./
USER 1000
ENV PORT 6677
EXPOSE $PORT
CMD ["node", "./index.js"]
