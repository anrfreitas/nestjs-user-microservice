#!/usr/bin/env bash

# Setting up environment variables
cp .env.example .env

# Initing the containers
docker-compose up -d
