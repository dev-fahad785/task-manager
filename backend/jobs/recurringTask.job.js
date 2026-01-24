import cron from 'node-cron';
import { processRecurringTasks } from '../services/recurringTask.service.js';

/**
 * Start the recurring task generation cron job
 * Runs daily at midnight (00:00) to generate recurring task instances
 */
export const startRecurringTaskJob = () => {
    // Run at midnight every day
    cron.schedule('0 0 * * *', async () => {
        console.log('⏰ Running recurring task generation job...');
        
        try {
            const processedCount = await processRecurringTasks();
            console.log(`✅ Recurring task job completed. Processed ${processedCount} tasks.`);
        } catch (error) {
            console.error('❌ Error in recurring task job:', error);
        }
    });

    console.log('🔄 Recurring task cron job initialized (runs daily at midnight)');
};
