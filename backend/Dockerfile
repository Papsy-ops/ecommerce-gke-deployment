FROM node:18 AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

FROM node:18-alpine
WORKDIR /app
COPY --from=build /usr/src/app /app
EXPOSE 5000
CMD ["node", "server.js"]


      #- MONGODB_URI=mongodb://narina:sa12345%25@mongo:27017/yolomy?authSource=admin
         # environment:
    #  - MONGO_INITDB_ROOT_USERNAME=narina
     # - MONGO_INITDB_ROOT_PASSWORD=sa12345%