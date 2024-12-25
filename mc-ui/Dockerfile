# Use the official Node.js image as the base
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the Vite development server port
EXPOSE 5173

# Start the Vite server in development mode
CMD ["npm", "run", "dev", "--", "--host"]

