import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';

// Initialize WhatsApp client
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    executablePath: '/usr/bin/chromium',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true,
  },
});

client.on('qr', (qr) => {
    console.log('📱 Scan this QR code in your WhatsApp:');
    qrcode.generate(qr, { small: true });
});
  
client.on('ready', async () => {
    console.log('✅ WhatsApp Client is ready!');
});

client.on('disconnected', (reason) => {
    console.log('🔌 Client was disconnected:', reason);
});
  
client.on('auth_failure', (msg) => {
    console.error('❌ Authentication failure:', msg);
});

export default client;
