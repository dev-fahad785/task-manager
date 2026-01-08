import cron from 'node-cron';
import { sendReminderForAllUsers } from '../whatsappBot/whatsappBot.controller.js';
import { registeredUsers } from '../services/whatsapp/state.js';
import { sendMessageWithDelay } from '../services/whatsapp/queue.js';

export const startReminderJob = () => {
    // Run reminders every 3 hours
    cron.schedule('0 */3 * * *', async () => {
        console.log('⏰ Running scheduled task...');

        try {
            const reminders = await sendReminderForAllUsers();
            console.log(`📋 Found ${reminders.length} reminders to send`);

            // Filter reminders to only include registered users
            const filteredReminders = reminders.filter(reminder =>
                registeredUsers.has(reminder.number)
            );

            console.log(`📱 Sending to ${filteredReminders.length} registered users (filtered from ${reminders.length})`);

            // Shuffle reminders array to randomize sending order
            const shuffledReminders = filteredReminders.sort(() => Math.random() - 0.5);

            for (let i = 0; i < shuffledReminders.length; i++) {
                const reminder = shuffledReminders[i];
                const chatId = `${reminder.number}@c.us`;

                // Add randomized delay between reminders (5-15 minutes)
                const delayBetweenReminders = Math.random() * 600000 + 300000; // 5-15 minutes

                setTimeout(async () => {
                    try {
                        // Double check user is still registered before sending
                        if (registeredUsers.has(reminder.number)) {
                            await sendMessageWithDelay(chatId, reminder.message);
                            console.log(`✅ Reminder sent to ${reminder.number}`);
                        } else {
                            console.log(`⏭️ Skipped reminder for logged out user: ${reminder.number}`);
                        }
                    } catch (error) {
                        console.error(`❌ Failed to send reminder to ${reminder.number}:`, error);
                    }
                }, i * delayBetweenReminders);
            }
        } catch (err) {
            console.error('❌ Error while processing reminders:', err);
        }
    });
};
