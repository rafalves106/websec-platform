// Bot de WhatsApp usando whatsapp-web.js — grátis, sem precisar de aprovação
// da Meta. Na primeira execução, escaneia o QR code com o WhatsApp do celular.
// Ideal pra uso pessoal (um único usuário). Se no futuro quiser abrir pra
// mais gente, aí sim migra pra API oficial do WhatsApp Business.

require('dotenv').config();
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const cron = require('node-cron');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const MY_NUMBER = process.env.MY_WHATSAPP_NUMBER; // formato: 55DDDNUMERO@c.us
const REMINDER_TIME = process.env.REMINDER_CRON || '0 19 * * 1-5'; // 19h, seg-sex

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    // dentro do Docker usa o Chromium instalado no sistema (ver Dockerfile);
    // localmente (fora do container) deixa undefined que o puppeteer baixa o próprio
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
});

client.on('qr', (qr) => {
  console.log('Escaneie o QR code abaixo com o WhatsApp do seu celular:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Bot conectado! Lembrete agendado para:', REMINDER_TIME);

  cron.schedule(REMINDER_TIME, () => {
    sendDailyReminder();
  });
});

async function sendDailyReminder() {
  const messages = [
    '🏍️ Hora de acelerar nos estudos! Sua sessão de hoje já está pronta.',
    '⚡ Bora manter o streak vivo. Desafio de hoje te espera.',
    '🔧 Sessão de hoje carregada. Vamos destravar mais um módulo?',
  ];
  const message = messages[Math.floor(Math.random() * messages.length)];

  await client.sendMessage(MY_NUMBER, `${message}\n\n${FRONTEND_URL}/hoje`);
  console.log('Lembrete enviado às', new Date().toLocaleTimeString());
}

client.initialize();

// Permite disparar manualmente pra teste: node index.js --now
if (process.argv.includes('--now')) {
  client.on('ready', () => sendDailyReminder());
}
