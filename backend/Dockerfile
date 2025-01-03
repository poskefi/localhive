# Dockerfile for Backend
FROM node:18
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the application files
COPY . .

# Install dockerize
# RUN apt-get update && \
#     apt-get install -y wget && \
#     wget -O /usr/local/bin/dockerize https://github.com/jwilder/dockerize/releases/download/v0.8.0/dockerize-linux-amd64-v0.8.0.tar.gz && \
#     chmod +x /usr/local/bin/dockerize

# Copy wait-for-it.sh to the container
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

CMD ["/wait-for-it.sh", "db:3306", "--", "node", "app.js"]


# Use dockerize to wait for the database
#CMD ["dockerize", "-wait", "tcp://db:3306", "-timeout", "60s", "node", "app.js"]

EXPOSE 5000
