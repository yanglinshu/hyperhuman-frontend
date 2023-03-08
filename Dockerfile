# Base image
FROM node:18

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Bundle app source
COPY . .

RUN rm -rf ./dist ./node_modules

# Install app dependencies
RUN npm install
RUN npm install -g serve

# Creates a "dist" folder with the production build
RUN npm run build

# Start the server using the production build
CMD [ "serve", "-s", "build" ]
