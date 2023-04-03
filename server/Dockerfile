# Use Node v16 as the base image
FROM node:16

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 9600

# ARG ATLAS_URI

# Run node
CMD ["node", "server.js"]
