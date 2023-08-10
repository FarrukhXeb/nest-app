#!/bin/sh

#Run migrations before starting the server
yarn migration:run:test
yarn test:e2e