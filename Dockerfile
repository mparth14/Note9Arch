# Use an official Node.js runtime as the base image
FROM node:16-alpine AS builder

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install npm dependencies
RUN npm install --legacy-peer-deps

# Copy the remaining application code to the working directory
COPY . .

RUN npm run build

FROM node:16-alpine


WORKDIR /app

COPY --from=builder /app .

EXPOSE 4173

# Define the command to run the app with --host option
CMD ["npm", "run", "preview"]
