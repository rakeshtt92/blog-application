# # # Step 1: Build Angular app
# # FROM node:18 AS build
# # WORKDIR /app
# # COPY package*.json ./
# # RUN npm install
# # COPY . .
# # RUN npm run build

# # # Step 2: Serve using Nginx
# # FROM nginx:alpine
# # COPY --from=build /app/dist /usr/share/nginx/html
# # EXPOSE 80
# # CMD ["nginx", "-g", "daemon off;"]


# # FROM node:22-alpine

# # WORKDIR /app

# # COPY package*.json ./

# # RUN npm install

# # COPY . .

# # EXPOSE 8000

# # CMD ["node", "app.js"]



# # Dockerfile
# FROM node:18

# # Set working directory
# WORKDIR /app

# # Copy package.json and package-lock.json
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy the rest of the app
# COPY . .

# # Expose port your app uses
# EXPOSE 8000

# # Command to start your app
# CMD ["node", "app.js"]

# Use Node.js 18 LTS
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app files
COPY . .

# Expose the port your app listens on
EXPOSE 80

# Correct CMD syntax to start Node
CMD ["node", "app.js"] 