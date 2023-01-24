# change with the Node.js version of your choice
ARG NODE_VERSION="16.19.0"

# change with the Linux Alpine version of your choice
ARG ALPINE_VERSION="3.17"

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS base

ENV NODE_ENV development

WORKDIR /app

ADD startup.sh /user/bin/startup.sh
RUN chmod +x /user/bin/startup.sh

RUN apk add --update --no-cache openssl1.1-compat
RUN apk add --no-cache git openssh

EXPOSE 9999

CMD ["sh", "/user/bin/startup.sh"]