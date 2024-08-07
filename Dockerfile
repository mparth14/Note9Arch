# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install npm dependencies
RUN npm install --legacy-peer-deps

# Copy the remaining application code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 5173
EXPOSE 4173

# Define the command to run the app with --host option
CMD ["npm", "run", "build"]
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
