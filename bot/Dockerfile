FROM node:20-slim

# whatsapp-web.js roda um Chromium por baixo (via puppeteer) pra controlar o WhatsApp Web
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdrm2 \
    libgbm1 \
    libnspr4 \
    libnss3 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY . .

# sessão do WhatsApp (LocalAuth) precisa persistir entre restarts,
# senão você tem que escanear o QR code toda vez
VOLUME ["/app/.wwebjs_auth"]

CMD ["node", "index.js"]
