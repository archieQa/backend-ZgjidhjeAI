# Use the official Node.js image as the base
FROM node:16-alpine 

# Set working directory inside the container
WORKDIR /app 

# Copy package.json and package-lock.json into the working directory
COPY package.json . 
COPY package-lock.json . 

# Install dependencies
RUN npm install 

# Copy the rest of the application files
COPY . .

# Expose port specified in your .env file or default to 5000
EXPOSE 5000 

# Define the command to start the application
CMD ["node", "app.js"] 
