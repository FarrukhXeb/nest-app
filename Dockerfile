FROM node:18-alpine as base
WORKDIR /app
COPY package*.json yarn.lock ./
RUN yarn install
COPY . .

FROM base as test
COPY ./script.sh /
RUN chmod +x /script.sh
ENTRYPOINT ["/script.sh"]

FROM base as prod
EXPOSE 3000
CMD ["yarn", "start"]
