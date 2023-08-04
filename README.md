# NestJs Application

This is a simple example of how to create an API with nestjs.

## Installation

```bash
$ yarn install
```

Setup the `.env` file using the `.env.example`. After setting up the database 

```bash
$ yarn migration:run
```

This will migrate and insert dummy data in your database.

```
Test user
email: admin@example.com
password: testing1234
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov

# To run test in a docker environment
$ yarn run test:e2e:docker
```
