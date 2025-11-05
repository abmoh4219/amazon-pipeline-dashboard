# Use Node.js 22 as the base image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Install NestJS CLI globally
RUN npm install -g @nestjs/cli

# Copy package.json and package-lock.json first (to leverage Docker caching)
COPY package.json package-lock.json* ./

# Install dependencies including devDependencies for development
RUN npm install
# Explicitly install class-validator and class-transformer which are required by NestJS
RUN npm install class-validator class-transformer

# Copy the rest of the application code
COPY . .

# Expose port 3000 for the application
EXPOSE 3000

# Start the application in development mode with hot-reload
CMD ["npm", "run", "start:dev"]