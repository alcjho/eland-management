# Use Node.js as the base image
FROM node:22-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the monorepo package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the monorepo code (including all microservices)
COPY . .

# Expose default NestJS ports (customizable per service)
EXPOSE 3000 5001 5002 5003 5004 5005

# Start the application (you can override this in each service)
CMD ["nest", "start", "start"]