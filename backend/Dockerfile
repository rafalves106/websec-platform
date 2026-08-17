FROM node:20-slim

# better-sqlite3 precisa compilar código nativo
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY . .

# volume vai persistir o arquivo do banco fora do container
VOLUME ["/app/data"]

EXPOSE 3001
CMD ["node", "src/index.js"]
