import cron from 'node-cron';
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import User from './models/user.model.js';
import { addWhatsappSubscriber, removeWhatsappSubscriber } from './controllers/user.controller.js';
import { getTodaysTasks, getTomrrowsTasks, getUpcomingTasks, getAllTasks, sendReminderForAllUsers, productivityReport } from './whatsappBot/whatsappBot.controller.js';
import {runWitTest}from './wit.js'
import { addTaskFromWhatsapp } from './utils/taskUtils.js';
// Store registered users and their attempt counts
const registeredUsers = new Set();
const userAttempts = new Map(); // Track failed attempts per user

const pendingConfirmations = new Set(); // Store users who requested logout
const MAX_ATTEMPTS = 3;
const BLOCK_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

// Rate limiting for message sending
const messageQueue = [];
let isProcessingQueue = false;

// Initialize WhatsApp client
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true,
  },
});

// Utility function to add random delay
const randomDelay = (min = 2000, max = 5000) => {
  return new Promise(resolve => {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    setTimeout(resolve, delay);
  });
};

// Enhanced message sending with queue and delays
const sendMessageWithDelay = async (chatId, message, delay = null) => {
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

// Process message queue to prevent spam detection
const processMessageQueue = async () => {
  if (isProcessingQueue || messageQueue.length === 0) return;

  isProcessingQueue = true;

  while (messageQueue.length > 0) {
    const { chatId, message, delay, resolve, reject } = messageQueue.shift();

    try {
      await randomDelay(delay);
      await client.sendMessage(chatId, message);
      console.log(`✅ Message sent to ${chatId.split('@')[0]} with ${Math.round(delay)}ms delay`);
      resolve();
    } catch (error) {
      console.error(`❌ Failed to send message to ${chatId}:`, error);
      reject(error);
    }
  }

  isProcessingQueue = false;
};
const waitingForTaskInput = new Set(); // Track users waiting to input tasks

// Show QR on terminal
client.on('qr', (qr) => {
  console.log('📱 Scan this QR code in your WhatsApp:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
  console.log('✅ WhatsApp Client is ready!');

  // Auto-register users from database
  try {
    // Option 1: Use the existing function (once imported)
    // const activeUsers = await getAllActiveWhatsAppUsers();

    // Option 2: Alternative approach if you want to modify
    const activeUsers = await User.find({ whatsappNumber: { $exists: true } });

    activeUsers.forEach(user => {
      registeredUsers.add(user.whatsappNumber);
    });
    console.log(`📱 Auto-registered ${activeUsers.length} users`);
  }
  catch (error) {
    console.error('Failed to auto-register users:', error);
  }

  // Run reminders every hour with randomized sending
  // '*/10 * * * * *' for every 10 seconds
  // '*/1 * * * *' for every minute
  // '0 */3 * * *' for every 3 hours
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
});

// Enhanced menu function
const sendMenu = async (chatId) => {
  const menuText = `*TaskAI Studio - Main Menu*

*TASKS*
*1* - Today's Tasks
*2* - Tomorrow's Tasks
*3* - Upcoming Tasks
*4* - All Tasks

*INSIGHTS*
*5* - Productivity Report
*6* - Analytics

*SUPPORT*
*7* - Add Task
*8* - Feedback
*9* - Contact

*0* - Main Menu
Type "LOGOUT" to disconnect.`;

  await sendMessageWithDelay(chatId, menuText);
};

// Check if user is temporarily blocked
const isUserBlocked = (number) => {
  const attempts = userAttempts.get(number);
  if (!attempts) return false;

  const { count, lastAttempt } = attempts;
  const now = Date.now();

  if (count >= MAX_ATTEMPTS && (now - lastAttempt) < BLOCK_DURATION) {
    return true;
  }

  // Reset attempts if block duration has passed
  if (count >= MAX_ATTEMPTS && (now - lastAttempt) >= BLOCK_DURATION) {
    userAttempts.delete(number);
    return false;
  }

  return false;
};

// Record failed attempt
const recordFailedAttempt = (number) => {
  const attempts = userAttempts.get(number) || { count: 0, lastAttempt: 0 };
  attempts.count++;
  attempts.lastAttempt = Date.now();
  userAttempts.set(number, attempts);
};

// Get remaining attempts
const getRemainingAttempts = (number) => {
  const attempts = userAttempts.get(number);
  if (!attempts) return MAX_ATTEMPTS;
  return Math.max(0, MAX_ATTEMPTS - attempts.count);
};

// Enhanced menu selection handler
const handleMenuSelection = async (chatId, selection, userName, number) => {
  let responseMessage = '';

  try {
    switch (selection) {
      case '0':
        await sendMenu(chatId);
        return;
      case '1':
        try {
          const { todaysTasks } = await getTodaysTasks(number);

          if (!todaysTasks || todaysTasks.length === 0) {
            responseMessage = `*Today's Tasks*

No tasks scheduled for today.

Visit www.taskai.studio to add tasks.
Type *0* for main menu.`;
          } else {
            const todaysTaskList = todaysTasks
              .map((task, index) => `${index + 1}. ${task.title}\n   Due: ${new Date(task.dueDate).toLocaleDateString()}`)
              .join('\n\n');

            responseMessage = `*Today's Tasks*

${todaysTaskList}

Manage at: www.taskai.studio
Type *0* for main menu.`;
          }
        } catch (error) {
          console.error('Error fetching today\'s tasks:', error);
          responseMessage = `*Error*

Unable to fetch today's tasks.
Please try again later.

Type *0* for main menu.`;
        }
        break;
      case '2':
        try {
          const { tomorrowsTasks } = await getTomrrowsTasks(number);

          if (!tomorrowsTasks || tomorrowsTasks.length === 0) {
            responseMessage = `*Tomorrow's Tasks*

No tasks scheduled for tomorrow.

Visit www.taskai.studio to add tasks.
Type *0* for main menu.`;
          } else {
            const tomorrowsTaskList = tomorrowsTasks
              .map((task, index) => `${index + 1}. ${task.title}\n   Due: ${new Date(task.dueDate).toLocaleDateString()}`)
              .join('\n\n');

            responseMessage = `*Tomorrow's Tasks*

${tomorrowsTaskList}

Manage at: www.taskai.studio
Type *0* for main menu.`;
          }
        } catch (error) {
          console.error('Error fetching tomorrow\'s tasks:', error);
          responseMessage = `*Error*

Unable to load tomorrow's tasks.
Please try again later.

Type *0* for main menu.`;
        }
        break;
      case '3':
        try {
          const { upcomingTasks } = await getUpcomingTasks(number);

          if (!upcomingTasks || upcomingTasks.length === 0) {
            responseMessage = `*Upcoming Tasks*

No upcoming tasks found.

Visit www.taskai.studio to add tasks.
Type *0* for main menu.`;
          } else {
            const upcomingTaskList = upcomingTasks
              .map((task, index) => `${index + 1}. ${task.title}\n   Due: ${new Date(task.dueDate).toLocaleDateString()}`)
              .join('\n\n');

            responseMessage = `*Upcoming Tasks*

${upcomingTaskList}

Manage at: www.taskai.studio
Type *0* for main menu.`;
          }
        } catch (error) {
          console.error('Error fetching upcoming tasks:', error);
          responseMessage = `*Error*

Unable to load upcoming tasks.
Please try again later.

Type *0* for main menu.`;
        }
        break;
      case '4':
        try {
          const { allTasks } = await getAllTasks(number);

          if (!allTasks || allTasks.length === 0) {
            responseMessage = `*All Tasks*

No tasks found.

Visit www.taskai.studio to create tasks.
Type *0* for main menu.`;
          } else {
            const taskList = allTasks
              .slice(0, 10)
              .map((task, index) => `${index + 1}. ${task.title}\n   ${new Date(task.dueDate).toLocaleDateString()}`)
              .join('\n\n');

            const totalCount = allTasks.length;
            const showingCount = Math.min(10, totalCount);

            responseMessage = `*All Tasks*

Showing ${showingCount} of ${totalCount} tasks:

${taskList}

${totalCount > 10 ? `\n+ ${totalCount - 10} more tasks` : ''}

Full list: www.taskai.studio
Type *0* for main menu.`;
          }
        } catch (error) {
          console.error('Error fetching all tasks:', error);
          responseMessage = `*Error*

Unable to load tasks.

Visit www.taskai.studio directly.
Type *0* for main menu.`;
        }
        break;
      case '5':
        try {
          const { report } = await productivityReport(number);

          const completionPercentage = report.totalTasks > 0 ?
            Math.round((report.completedTasks / report.totalTasks) * 100) : 0;

          responseMessage = `*Productivity Report*

Total Tasks: ${report.totalTasks}
Completed: ${report.completedTasks}
Pending: ${report.pendingTasks}
Overdue: ${report.overDueTasks}

Completion Rate: ${completionPercentage}%

Detailed analytics: www.taskai.studio
Type *0* for main menu.`;

        } catch (error) {
          console.error('Error fetching productivity report:', error);
          responseMessage = `*Error*

Report unavailable. Try again later.

Visit www.taskai.studio for analytics.
Type *0* for main menu.`;
        }
        break;
      case '6':
        responseMessage = `*Analytics Dashboard*

Status: Connected & Active
Response Time: Instant
Notifications: Enabled

Detailed analytics: www.taskai.studio

Type *0* for main menu.`;
        break;
      case '7':
        waitingForTaskInput.add(number);
        
        responseMessage = `*AI Task Parser*

Please describe your task:

Examples:
• "Buy groceries today 6pm high priority"
• "Submit report by Friday urgent"

Type your task below:`;
        break;
      case '8':
        responseMessage = `*Feedback*

Share your thoughts:
taskai.studio@gmail.com

Or visit: www.taskai.studio/feedback

Type *0* for main menu.`;
        break;
      case '9':
        responseMessage = `*Connect With Us*

TikTok: https://www.tiktok.com/@taskai.studio
LinkedIn: https://www.linkedin.com/company/taskai-studio
Twitter: https://twitter.com/taskai_studio
Instagram: https://www.instagram.com/taskai.studio

Type *0* for main menu.`;
        break;
      default:
        responseMessage = `*Invalid Selection*

Please choose a number from 0-9.

Type *0* for menu or *help*.`;
        break;
    }

    await sendMessageWithDelay(chatId, responseMessage);

  } catch (error) {
    console.error('Error in handleMenuSelection:', error);
    await sendMessageWithDelay(chatId, `*Error*

Something went wrong. Please try again.

Type *0* for main menu.`);
  }
};

// Message listener with enhanced error handling
client.on('message', async (message) => {
  // Skip if message has no body
  if (!message.body) return;

  const content = message.body.trim();
  const contentLower = content.toLowerCase();
  const number = message.from.split('@')[0];
  const notifyName = message._data?.notifyName || 'Friend';

  console.log(`📨 ${number}: ${content}`);

  // Check if user is temporarily blocked
    if (isUserBlocked(number)) {
      const attempts = userAttempts.get(number);
      const timeLeft = Math.ceil((BLOCK_DURATION - (Date.now() - attempts.lastAttempt)) / 60000);

      await sendMessageWithDelay(message.from,
        `*Too Many Failed Attempts*

Please wait ${timeLeft} minutes before trying again.

Contact: taskai.studio@gmail.com`
      );
      return;
    }

  const isRegistered = registeredUsers.has(number);

  if (!isRegistered) {
    // Check if message starts with "secret code:" - exact format required
    if (content.toLowerCase().startsWith('secret code:')) {
      const subscribeMatch = content.match(/^secret\s*code\s*:\s*([a-fA-F0-9]{24})$/i);

      if (subscribeMatch) {
        // ... keep existing code for valid secret code
        const secretCode = subscribeMatch[1];
        console.log(`🔑 Processing subscription with Secret Code: ${secretCode}`);

        try {
          const user = await addWhatsappSubscriber(secretCode, number);

          // Success - clear any failed attempts
          userAttempts.delete(number);
          registeredUsers.add(number);

          await sendMessageWithDelay(message.from,
            `*Welcome to TaskAI Studio*

Successfully connected!

You'll now receive task reminders.`
          );

          // Send menu after a brief delay
          setTimeout(async () => {
            await sendMenu(message.from);
          }, 3000);

        } catch (err) {
          console.error('❌ Subscription failed:', err.message);
          recordFailedAttempt(number);
          const remaining = getRemainingAttempts(number);

          let errorMsg = `*Connection Failed*

`;

          if (err.message.includes('not found') || err.message.includes('invalid')) {
            errorMsg += `Invalid secret code. Please check and try again.

`;
          } else {
            errorMsg += `Unable to connect. Please try again.

`;
          }

          errorMsg += `Format: secret code: your-24-digit-code
Example: secret code: 507f1f77bcf86cd799439011

`;

          if (remaining > 0) {
            errorMsg += `${remaining} attempts remaining`;
          } else {
            errorMsg += `No more attempts. Please wait 10 minutes.`;
          }

          await sendMessageWithDelay(message.from, errorMsg);
        }
      } else {
        // Secret code format is altered
        await sendMessageWithDelay(message.from, `*Secret code format incorrect*

Please try again.`);
      }
    }
    // Bot will NOT respond to any other messages from unregistered users
  }

  else {
    // Handle registered user interactions
    if (contentLower === 'logout' || contentLower === 'disconnect') {
      pendingConfirmations.add(number);
      await sendMessageWithDelay(message.from,
        `*Logout Confirmation*

Are you sure you want to disconnect from TaskAI Studio?

• You'll stop receiving reminders
• You'll need your secret code to reconnect

Type *confirm* to logout or *0* to return to menu.`
      );

    } else if (contentLower === 'confirm') {
      if (pendingConfirmations.has(number)) {
        removeWhatsappSubscriber(number);
        registeredUsers.delete(number);
        pendingConfirmations.delete(number);
        console.log(`🔌 User ${number} logged out successfully`);
        await sendMessageWithDelay(message.from,
          `*Successfully Logged Out*

Thank you for using TaskAI Studio!

To reconnect anytime:
secret code: your-24-digit-code

www.taskai.studio`
        );
      } else {
        await sendMessageWithDelay(message.from,
          `*Logout not initiated*

Please type *logout* or *disconnect* first.`
        );
      }

    } else if (/^secret code\s*:\s*\w+/i.test(content)) {
      await sendMessageWithDelay(message.from,
        `*Already Connected*

You are already connected to TaskAI Studio.

To switch accounts, type *logout* first.`
      );

    } else if (content >= '0' && content <= '9' && content.length === 1) {
      await handleMenuSelection(message.from, content, notifyName, number);

    } else if (contentLower === 'menu' || contentLower === 'help' || contentLower === 'start') {
      await sendMenu(message.from);

    } else {
      // Check if user is waiting to input a task for AI parsing
      if (waitingForTaskInput.has(number)) {
        try {
          // Remove user from waiting state
          waitingForTaskInput.delete(number);
        
          // Send the user's message to Wit AI
          const witres = await runWitTest(content);
          console.log('Wit AI result:', witres);
          addTaskFromWhatsapp(number,witres)
          
          await sendMessageWithDelay(message.from, `*AI Task Analysis Complete*

Task: "${content}"

AI Analysis Results:
• Intent: ${witres.intent || 'Not detected'}
• Date/Time: ${witres.datetime || 'Not specified'}  
• Priority: ${witres.priority || 'Not specified'}

Visit www.taskai.studio to save this task.

Type *0* for main menu or *7* for another task.`);
          return; // Exit early to prevent other message handling
          
        } catch (error) {
          console.error('Error with Wit AI analysis:', error);
          await sendMessageWithDelay(message.from, `*AI Analysis Failed*

Could not analyze your task: "${content}"

Please try:
• Option *7* to try again
• Visit www.taskai.studio to add manually

Type *0* for main menu.`);
          }
        }
      }
  }

});

// Enhanced error handling
client.on('disconnected', (reason) => {
  console.log('🔌 Client was disconnected:', reason);
});

client.on('auth_failure', (msg) => {
  console.error('❌ Authentication failure:', msg);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Shutting down gracefully...');
  client.destroy();
  process.exit(0);
});

// Start the client
client.initialize();

export default client;