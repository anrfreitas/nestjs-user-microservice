#!/bin/bash

# Making sure to clean the cache
yarn cache clean

# Installing all dependencies
yarn

# Setting up permission to all files and folders to be readable/writable
# by any user outside this container. Reasons:
# 1- This file start.sh is copied to the container and it's executed there inside
# 2- Because the folders are mapped and files generated has container ownership
chmod -R a+rwX ./

# Running the server
yarn dev