# Step 1: Build the React application
FROM node:20.10.0-alpine AS build

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy the package*.json files
COPY package*.json ./

# Step 4: Install the dependencies
RUN npm install

# Step 5: Copy the rest of the application
COPY . .

# Step 6: Build the application
RUN npm run build

# Step 7: Serve the application from a lightweight nginx image
FROM nginx:alpine

# Expose port 80
EXPOSE 80

# Define the command to run the app (this will use the default nginx entrypoint)
CMD ["nginx", "-g", "daemon off;"]