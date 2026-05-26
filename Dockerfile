FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy all files and build
COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
