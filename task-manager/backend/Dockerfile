FROM node:18

WORKDIR /app

# Install netcat (Debian package name is netcat-openbsd)
RUN apt-get update && apt-get install -y netcat-openbsd

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
