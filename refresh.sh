#!/usr/bin/env bash

# it will refresh all external dependencies
yarn cache clean
rm -rf ./node_modules/@nestjs-*
yarn install --check-files
