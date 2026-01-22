import client from './client.js';

// Rate limiting for message sending
const messageQueue = [];
let isProcessingQueue = false;

// Utility function to add random delay
const randomDelay = (min = 2000, max = 5000) => {
  return new Promise(resolve => {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    setTimeout(resolve, delay);
  });
};

// Process message queue to prevent spam detection
const processMessageQueue = async () => {
  if (isProcessingQueue || messageQueue.length === 0) return;

  isProcessingQueue = true;

  while (messageQueue.length > 0) {
    const { chatId, message, delay, resolve, reject } = messageQueue.shift();

    try {
      await randomDelay(delay);
      // Disable sendSeen to prevent "Cannot read properties of undefined (reading 'markedUnread')" error
      await client.sendMessage(chatId, message, { sendSeen: false });
      console.log(`✅ Message sent to ${chatId.split('@')[0]} with ${Math.round(delay)}ms delay`);
      resolve();
    } catch (error) {
      console.error(`❌ Failed to send message to ${chatId}:`, error);
      reject(error);
    }
  }

  isProcessingQueue = false;
};

// Enhanced message sending with queue and delays
export const sendMessageWithDelay = async (chatId, message, delay = null) => {
  return new Promise((resolve, reject) => {
    messageQueue.push({
      chatId,
      message,
      delay: delay || Math.random() * 3000 + 2000, // Random delay 2-5 seconds
      resolve,
      reject
    });
    processMessageQueue();
  });
};
