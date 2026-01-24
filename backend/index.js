import dotenv from 'dotenv';

dotenv.config();

import { connectDB } from './config/db.js';
import app from './app.js';
import './whatsapp.bot.js'; // Keep the bot running
import { startReminderJob } from './jobs/reminder.job.js';
import { startRecurringTaskJob } from './jobs/recurringTask.job.js';

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Start cron jobs
startReminderJob();
startRecurringTaskJob();

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
