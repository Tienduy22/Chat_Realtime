FROM node:20-alpine

WORKDIR /chat_realtime/backend

COPY package*.json ./

RUN npm install

COPY . .

# RUN npm run build  # disabled - using runtime babel-node

EXPOSE 8080

CMD ["npm", "start"]

# docker build --tag node-docker .

# docker run -p 8080:8080 -d node-docker

# docker rm abc123 - Xóa container

# docker rmi node-docker - xóa images