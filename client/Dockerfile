FROM node:lts-alpine
WORKDIR /api
COPY package*.json ./
EXPOSE 4200
RUN npm install
#add app
COPY . .
RUN $(npm bin)/ng build --prod



CMD ["npm","start"]