import client from './services/whatsapp/client.js';
import User from './models/user.model.js';
import { handleIncomingMessage } from './services/whatsapp/messageHandler.js';
import { startReminderJob } from './jobs/reminder.job.js';
import { registeredUsers } from './services/whatsapp/state.js';

client.on('ready', async () => {
  // Auto-register users from database
  try {
    const activeUsers = await User.find({ whatsappNumber: { $exists: true } });

    activeUsers.forEach(user => {
      registeredUsers.add(user.whatsappNumber);
    });
    console.log(`📱 Auto-registered ${activeUsers.length} users`);
  }
  catch (error) {
    console.error('Failed to auto-register users:', error);
  }

  // Start cron jobs
  startReminderJob();
});

client.on('message', handleIncomingMessage);

// Start the client
client.initialize();

export default client;
