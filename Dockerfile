FROM node:latest
RUN mkdir -p /usr/src/boardgame-bot/
WORKDIR /usr/srv/boardgame-bot/
COPY . /usr/srv/boardgame-bot/

RUN rm -rf /usr/srv/boardgame-bot/.git
RUN npm install

CMD [ "npm", "production" ]
