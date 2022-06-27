FROM node:lts-alpine
WORKDIR /app
COPY package*.json .
RUN npm  install
#add app
COPY . .
EXPOSE 4004

CMD ["npm","start"]