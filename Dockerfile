FROM node:18-alpine as base
WORKDIR /app
COPY package*.json yarn.lock ./
RUN yarn install
COPY . .

FROM base as test
CMD ["yarn", "test:e2e"]

FROM base as prod
EXPOSE 3000
CMD ["yarn", "start"]
