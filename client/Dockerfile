# Stage 1: build react app
FROM node:16 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: serve with nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Copy entrypoint and env template to nginx folder
COPY entrypoint.sh /entrypoint.sh
COPY env-config.js.template /usr/share/nginx/html/env-config.js.template

# Make entrypoint executable
RUN chmod +x /entrypoint.sh

# Use entrypoint.sh to inject env vars at runtime and start nginx
ENTRYPOINT ["/entrypoint.sh"]
