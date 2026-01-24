import TaskModel from '../models/task.model.js';
import { DateTime } from 'luxon';

/**
 * Calculate the next occurrence date based on recurrence pattern
 * @param {Object} task - Task object with recurrence configuration
 * @returns {DateTime} - Next occurrence date
 */
export const calculateNextOccurrence = (task) => {
    const { recurrence } = task;
    
    if (!recurrence.enabled) {
        return null;
    }

    // Start from nextOccurrence if it exists, otherwise from dueDate
    const baseDate = recurrence.nextOccurrence 
        ? DateTime.fromISO(recurrence.nextOccurrence)
        : DateTime.fromISO(task.dueDate);

    let nextDate;

    switch (recurrence.pattern) {
        case 'daily':
            // Add interval days
            nextDate = baseDate.plus({ days: recurrence.interval });
            break;

        case 'weekly':
            // Find the next occurrence based on daysOfWeek
            if (!recurrence.daysOfWeek || recurrence.daysOfWeek.length === 0) {
                // Default to same day next week
                nextDate = baseDate.plus({ weeks: recurrence.interval });
            } else {
                // Find next matching day of week
                nextDate = findNextWeeklyOccurrence(baseDate, recurrence.daysOfWeek, recurrence.interval);
            }
            break;

        case 'monthly':
            // Add interval months
            const targetDay = recurrence.dayOfMonth || baseDate.day;
            nextDate = baseDate.plus({ months: recurrence.interval });
            
            // Handle end-of-month edge cases
            if (targetDay > nextDate.daysInMonth) {
                // If target day doesn't exist in this month, use last day
                nextDate = nextDate.set({ day: nextDate.daysInMonth });
            } else {
                nextDate = nextDate.set({ day: targetDay });
            }
            break;

        case 'yearly':
            // Add 1 year
            const targetMonth = recurrence.monthOfYear || baseDate.month;
            const targetDayOfMonth = recurrence.dayOfMonth || baseDate.day;
            
            nextDate = baseDate.plus({ years: 1 });
            nextDate = nextDate.set({ month: targetMonth, day: 1 });
            
            // Handle leap year edge case for Feb 29
            if (targetDayOfMonth > nextDate.daysInMonth) {
                nextDate = nextDate.set({ day: nextDate.daysInMonth });
            } else {
                nextDate = nextDate.set({ day: targetDayOfMonth });
            }
            break;

        default:
            return null;
    }

    // Check if next occurrence exceeds end date
    if (recurrence.endDate) {
        const endDate = DateTime.fromISO(recurrence.endDate);
        if (nextDate > endDate) {
            return null; // Stop recurring
        }
    }

    return nextDate;
};

/**
 * Find the next weekly occurrence based on days of week
 */
const findNextWeeklyOccurrence = (baseDate, daysOfWeek, interval) => {
    const sortedDays = [...daysOfWeek].sort((a, b) => a - b);
    const currentDayOfWeek = baseDate.weekday % 7; // Convert to 0=Sunday format
    
    // Find next day in current week
    const nextDayInWeek = sortedDays.find(day => day > currentDayOfWeek);
    
    if (nextDayInWeek !== undefined) {
        // Next occurrence is in the same week
        const daysToAdd = nextDayInWeek - currentDayOfWeek;
        return baseDate.plus({ days: daysToAdd });
    } else {
        // Next occurrence is in the next interval week(s)
        const firstDayOfWeek = sortedDays[0];
        const daysUntilNextWeek = (7 - currentDayOfWeek) + firstDayOfWeek;
        const weeksToAdd = interval - 1; // We're already moving to next week
        return baseDate.plus({ days: daysUntilNextWeek, weeks: weeksToAdd });
    }
};

/**
 * Generate a new task instance from recurring template
 * @param {Object} recurringTask - The recurring task template
 * @param {DateTime} dueDate - Due date for the new instance
 * @returns {Object} - New task object
 */
export const generateTaskInstance = async (recurringTask, dueDate) => {
    const newTask = {
        user_id: recurringTask.user_id,
        title: recurringTask.title,
        description: recurringTask.description,
        estTime: recurringTask.estTime,
        priority: recurringTask.priority,
        dueDate: dueDate.toISO(),
        completionStatus: 'Pending',
        isRecurringInstance: true,
        parentRecurringTaskId: recurringTask._id,
        recurrence: {
            enabled: false, // Instances don't recur themselves
        },
    };

    const createdTask = await TaskModel.create(newTask);
    console.log(`✅ Generated recurring task instance: ${createdTask.title} (due: ${dueDate.toFormat('yyyy-MM-dd')})`);
    
    return createdTask;
};

/**
 * Process all recurring tasks and generate instances
 * This function is called by the cron job
 */
export const processRecurringTasks = async () => {
    try {
        const now = DateTime.now();
        
        // Find all enabled recurring tasks where nextOccurrence is due
        const recurringTasks = await TaskModel.find({
            'recurrence.enabled': true,
            $or: [
                { 'recurrence.nextOccurrence': { $lte: now.toISO() } },
                { 'recurrence.nextOccurrence': { $exists: false } }, // First time setup
            ],
        });

        console.log(`📋 Found ${recurringTasks.length} recurring tasks to process`);

        for (const task of recurringTasks) {
            try {
                // If nextOccurrence doesn't exist, initialize it
                if (!task.recurrence.nextOccurrence) {
                    const initialDate = DateTime.fromISO(task.dueDate);
                    task.recurrence.nextOccurrence = initialDate.toISO();
                }

                const currentOccurrence = DateTime.fromISO(task.recurrence.nextOccurrence);
                
                // Generate task instance for current occurrence
                await generateTaskInstance(task, currentOccurrence);

                // Calculate next occurrence
                const nextOccurrence = calculateNextOccurrence(task);

                if (nextOccurrence) {
                    // Update nextOccurrence for future generation
                    task.recurrence.nextOccurrence = nextOccurrence.toISO();
                    await task.save();
                    console.log(`⏭️  Next occurrence for "${task.title}": ${nextOccurrence.toFormat('yyyy-MM-dd')}`);
                } else {
                    // No more occurrences (past end date or invalid pattern)
                    task.recurrence.enabled = false;
                    await task.save();
                    console.log(`🛑 Stopped recurring task: ${task.title} (reached end date or invalid pattern)`);
                }
            } catch (error) {
                console.error(`❌ Error processing recurring task ${task._id}:`, error);
            }
        }

        return recurringTasks.length;
    } catch (error) {
        console.error('❌ Error in processRecurringTasks:', error);
        throw error;
    }
};

/**
 * Update recurrence pattern for a task
 * @param {String} taskId - Task ID
 * @param {Object} newPattern - New recurrence configuration
 */
export const updateRecurrencePattern = async (taskId, newPattern) => {
    const task = await TaskModel.findById(taskId);
    
    if (!task) {
        throw new Error('Task not found');
    }

    if (task.isRecurringInstance) {
        throw new Error('Cannot update recurrence for a generated instance. Edit the parent template instead.');
    }

    task.recurrence = { ...task.recurrence, ...newPattern };
    
    // Recalculate next occurrence if pattern changed
    if (newPattern.pattern || newPattern.interval || newPattern.daysOfWeek || 
        newPattern.dayOfMonth || newPattern.monthOfYear) {
        const nextOccurrence = calculateNextOccurrence(task);
        if (nextOccurrence) {
            task.recurrence.nextOccurrence = nextOccurrence.toISO();
        }
    }

    await task.save();
    return task;
};

/**
 * Stop recurrence for a task
 * @param {String} taskId - Task ID
 */
export const stopRecurrence = async (taskId) => {
    const task = await TaskModel.findById(taskId);
    
    if (!task) {
        throw new Error('Task not found');
    }

    if (task.isRecurringInstance) {
        throw new Error('Cannot stop recurrence for a generated instance. Stop the parent template instead.');
    }

    task.recurrence.enabled = false;
    await task.save();
    
    console.log(`🛑 Stopped recurrence for task: ${task.title}`);
    return task;
};

/**
 * Check and generate recurring tasks on-demand
 * This is called when user opens dashboard to ensure tasks are up-to-date
 */
export const checkAndGenerateRecurringTasks = async (userId) => {
    try {
        const now = DateTime.now();
        
        // Find user's recurring tasks that need generation
        const recurringTasks = await TaskModel.find({
            user_id: userId,
            'recurrence.enabled': true,
        });

        let generatedCount = 0;

        for (const task of recurringTasks) {
            // Initialize nextOccurrence if not set
            if (!task.recurrence.nextOccurrence) {
                task.recurrence.nextOccurrence = DateTime.fromISO(task.dueDate).toISO();
            }

            const nextOccurrence = DateTime.fromISO(task.recurrence.nextOccurrence);

            // Generate all missed occurrences up to now
            while (nextOccurrence <= now) {
                await generateTaskInstance(task, nextOccurrence);
                generatedCount++;

                // Calculate next occurrence
                const newNextOccurrence = calculateNextOccurrence(task);
                
                if (newNextOccurrence) {
                    task.recurrence.nextOccurrence = newNextOccurrence.toISO();
                } else {
                    task.recurrence.enabled = false;
                    break;
                }
            }

            await task.save();
        }

        if (generatedCount > 0) {
            console.log(`✅ Generated ${generatedCount} recurring task instances for user ${userId}`);
        }

        return generatedCount;
    } catch (error) {
        console.error('❌ Error in checkAndGenerateRecurringTasks:', error);
        throw error;
    }
};
