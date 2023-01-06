FROM node:16-alpine

ENV NODE_ENV development

WORKDIR /app

ADD startup.sh /user/bin/startup.sh
RUN chmod +x /user/bin/startup.sh

RUN apk add --no-cache git openssh

EXPOSE 9999

CMD ["sh", "/user/bin/startup.sh"]