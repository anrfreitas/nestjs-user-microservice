#!/usr/bin/env bash

docker-compose up -d

cp .env.example .env

# (
#     # trying to start an existing container
#     docker container start zero-nestjs &&
#     echo -e "Container \033[0;32mzero-nestjs\033[0m was started!"
# )||
# (
#     # if previous command failed, we'll create a new container
#     docker run --name zero-nestjs -d -p 9040:9040 -p 9050:9050 -p 9060:9060 --net=nestjs-setup_normal -v $(pwd)k:/app nestjs/service:latest &&
#     echo -e "Container \033[0;32mzero-nestjs\033[0m was created!"
# )
