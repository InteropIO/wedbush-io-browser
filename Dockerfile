# Stage 1
# Build docker image of Vite-based React app
FROM node:20.10.0-alpine as build

# Set working directory
WORKDIR /usr/app

# Copy package.json and package-lock.json (or yarn.lock if using yarn)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Build the app
RUN npm run build

# Stage 2
# Prepare nginx to serve the static files
FROM nginx:stable-alpine

# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]