# syntax=docker/dockerfile:1

# Base image for the container.
FROM node:alpine

WORKDIR /app

COPY package*.json ./

# Install dependencies within the container.
RUN npm install

# Copy the rest of the source files into the image.
COPY . .

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD npm start
