import cron from 'node-cron';
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import User from './models/user.model.js';
import { addWhatsappSubscriber, removeWhatsappSubscriber } from './controllers/user.controller.js';
import { getTodaysTasks, getTomrrowsTasks, getUpcomingTasks, getAllTasks, sendReminderForAllUsers, productivityReport } from './whatsappBot/whatsappBot.controller.js';
import {runWitTest}from './wit.js'
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
  const menuText = `
🎯 *Welcome to TaskAI Studio Bot*

*What would you like to do today?*

*📋 TASKS*
*1* - 📊 Today's Tasks
*2* - 📅 Tomorrow's Tasks  
*3* - 🔮 Upcoming Tasks
*4* - 📚 All Tasks

*📊 INSIGHTS*
*5* - 📈 Productivity Report
*6* - 📊 Analytics Dashboard

*🛠️ SUPPORT*
*7* - 🆘 Technical Support
*8* - 💬 Send Feedback
*9* - 🌐 Social Media

*0* -  🔄 Show this menu again

❌ Type "LOGOUT" to disconnect your WhatsApp account.

*🎯 Simply reply with a number (0-9) to get started!*

_💡 Tip: You can type "menu" or "help" anytime to see this menu_
  `;

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
            responseMessage = `📅 *Today's Tasks*

Hello ${userName}! 👋

🤔 No tasks scheduled for today. Enjoy your free time!

*What you can do:*
• 🌐 Visit *www.taskai.studio* to add new tasks
• 📱 Plan tomorrow's schedule
• 📊 Check your productivity report (option 5)

📌 Type *0* to return to the main menu.`;
          } else {
            const todaysTaskList = todaysTasks
              .map((task, index) => `${index + 1}. ✅ ${task.title}\n   📅 Due: ${new Date(task.dueDate).toLocaleDateString()}`)
              .join('\n\n');

            responseMessage = `📊 *Today's Tasks*

Hello ${userName}! 👋
✅ *Status:* Connected & Active  
📱 *Last Sync:* ${new Date().toLocaleString()}

📝 *Your tasks for today:*
${todaysTaskList}

🌐 *Manage Tasks:* www.taskai.studio
📌 Type *0* for main menu`;
          }
        } catch (error) {
          console.error('Error fetching today\'s tasks:', error);
          responseMessage = `❌ *Oops! Something went wrong*

Unable to fetch today's tasks right now. This might be a temporary issue.

*Please try:*
• Wait a moment and try again
• Check option *7* for technical support
• Visit www.taskai.studio directly

📌 Type *0* to return to main menu.`;
        }
        break;

      case '2':
        try {
          const { tomorrowsTasks } = await getTomrrowsTasks(number);

          if (!tomorrowsTasks || tomorrowsTasks.length === 0) {
            responseMessage = `📅 *Tomorrow's Tasks*

Hello ${userName}! 👋

🌅 Tomorrow looks free! Perfect time to plan ahead.

*Suggestions:*
• 🌐 Add tasks at *www.taskai.studio*
• 📋 Review your upcoming tasks (option 3)
• 🎯 Set new goals

📌 Type *0* to return to main menu.`;
          } else {
            const tomorrowsTaskList = tomorrowsTasks
              .map((task, index) => `${index + 1}. 📋 ${task.title}\n   📅 Due: ${new Date(task.dueDate).toLocaleDateString()}`)
              .join('\n\n');

            responseMessage = `📅 *Tomorrow's Tasks*

Hello ${userName}! 👋

🌅 *Your tasks for tomorrow:*
${tomorrowsTaskList}

🌐 *Manage Tasks:* www.taskai.studio
📌 Type *0* for main menu`;
          }
        } catch (error) {
          console.error('Error fetching tomorrow\'s tasks:', error);
          responseMessage = `❌ *Unable to load tomorrow's tasks*

Please try again in a moment or contact support.

📌 Type *0* to return to main menu.`;
        }
        break;

      case '3':
        try {
          const { upcomingTasks } = await getUpcomingTasks(number);

          if (!upcomingTasks || upcomingTasks.length === 0) {
            responseMessage = `🔮 *Upcoming Tasks*

Hello ${userName}! 👋

🎉 Your schedule looks clear ahead! Time to plan something exciting.

*Ideas:*
• 🌐 Visit *www.taskai.studio* to add future tasks
• 📊 Check your productivity report (option 5)
• 🎯 Set long-term goals

📌 Type *0* to return to main menu.`;
          } else {
            const upcomingTaskList = upcomingTasks
              .map((task, index) => `${index + 1}. 🔮 ${task.title}\n   📅 Due: ${new Date(task.dueDate).toLocaleDateString()}`)
              .join('\n\n');

            responseMessage = `🔮 *Upcoming Tasks*

Hello ${userName}! 👋

📋 *Tasks coming up:*
${upcomingTaskList}

🌐 *Manage Tasks:* www.taskai.studio
📌 Type *0* for main menu`;
          }
        } catch (error) {
          console.error('Error fetching upcoming tasks:', error);
          responseMessage = `❌ *Can't load upcoming tasks right now*

Please try again later or visit www.taskai.studio directly.

📌 Type *0* to return to main menu.`;
        }
        break;

      case '4':
        try {
          const { allTasks } = await getAllTasks(number);

          if (!allTasks || allTasks.length === 0) {
            responseMessage = `📚 *All Tasks*

Hello ${userName}! 👋

🎯 Ready to get started? You haven't added any tasks yet!

*Get Started:*
• 🌐 Visit *www.taskai.studio* to create your first task
• 📱 Set up your productivity goals
• 🔔 Enable reminders

📌 Type *0* to return to main menu.`;
          } else {
            const taskList = allTasks
              .slice(0, 10) // Limit to first 10 tasks to avoid long messages
              .map((task, index) => `${index + 1}. 📋 ${task.title}\n   📅 ${new Date(task.dueDate).toLocaleDateString()}`)
              .join('\n\n');

            const totalCount = allTasks.length;
            const showingCount = Math.min(10, totalCount);

            responseMessage = `📚 *All Tasks*

Hello ${userName}! 👋

📊 *Showing ${showingCount} of ${totalCount} tasks:*

${taskList}

${totalCount > 10 ? `\n*And ${totalCount - 10} more tasks...*` : ''}

🌐 *Full List:* www.taskai.studio
📌 Type *0* for main menu`;
          }
        } catch (error) {
          console.error('Error fetching all tasks:', error);
          responseMessage = `❌ *Unable to load your tasks*

Something went wrong while fetching your task list.

*Try:*
• Option *7* for technical support
• Visit www.taskai.studio directly

📌 Type *0* to return to main menu.`;
        }
        break;

      case '5':
        try {
          const { report } = await productivityReport(number);

          const completionPercentage = report.totalTasks > 0 ?
            Math.round((report.completedTasks / report.totalTasks) * 100) : 0;

          const getMotivationalMessage = (percentage) => {
            if (percentage >= 80) return "🏆 Outstanding! You're crushing it!";
            if (percentage >= 60) return "💪 Great progress! Keep it up!";
            if (percentage >= 40) return "📈 You're getting there! Stay focused!";
            if (percentage >= 20) return "🎯 Good start! Let's build momentum!";
            return "🚀 Every journey starts with a single step!";
          };

          responseMessage = `📈 *Your Productivity Report*

Hello ${userName}! 👋

📊 *Task Overview:*
• 📝 Total Tasks: ${report.totalTasks}
• ✅ Completed: ${report.completedTasks}
• ⏳ Pending: ${report.pendingTasks}
• ⚠️ Overdue: ${report.overDueTasks}

📈 *Performance:*
• 🎯 Completion Rate: ${completionPercentage}%
• ⏳ Pending Rate: ${report.pendingRate}
• ⚠️ Overdue Rate: ${report.overDueRate}

${getMotivationalMessage(completionPercentage)}

🌐 *Detailed Analytics:* www.taskai.studio
📌 Type *0* for main menu`;

        } catch (error) {
          console.error('Error fetching productivity report:', error);
          responseMessage = `❌ *Report Temporarily Unavailable*

We're having trouble generating your productivity report right now.

*Alternative:*
• Try again in a few minutes
• Visit www.taskai.studio for full analytics
• Contact support (option 7)

📌 Type *0* to return to main menu.`;
        }
        break;

      case '6':
        responseMessage = `📊 *Analytics Dashboard*

Hello ${userName}! 👋

📈 *Quick Stats:*
• 📱 WhatsApp: Connected & Active
• ⚡ Response Time: Instant
• 🔔 Notifications: Enabled
• 📅 Active Since: ${new Date().toLocaleDateString()}

*🌐 For detailed analytics visit:*
www.taskai.studio

*Features Available:*
• 📊 Performance graphs
• 📅 Daily/weekly/monthly views
• 🎯 Goal tracking
• 📈 Progress trends

📌 Type *0* for main menu`;
        break;

      case '7':
        // Set user state to waiting for task input
        waitingForTaskInput.add(number);
        
        responseMessage = `🤖 *AI Task Parser*

Hello ${userName}! 👋

📝 *Please type your task below:*

*Examples:*
• "Call John about project deadline tomorrow 3pm"
• "Buy groceries this weekend high priority"
• "Submit report by Friday urgent"

💡 *I'll analyze your message and extract:*
• 🎯 Task intent
• 📅 Date/Time
• ⭐ Priority level

*Type your task now:* 👇`;
        break;

      case '8':
        responseMessage = `💬 *We Value Your Feedback!*

Hello ${userName}! 👋

*⭐ How are we doing?*
Your opinion helps us improve!

*📝 Share Your Thoughts:*
• ⭐ Rate our service (1-5 stars)
• 💡 Suggest new features
• 🐛 Report any bugs
• 💭 General feedback

*📧 Send feedback to:*
taskai.studio@gmail.com

*🌐 Or use our website:*
www.taskai.studio/feedback

Thank you for helping us grow! 🙏

📌 Type *0* for main menu`;
        break;

      case '9':
        responseMessage = `🌐 *Connect With Us!*

Hello ${userName}! 👋

*📱 Follow TaskAI Studio:*

🎵 *TikTok:* https://www.tiktok.com/@taskai.studio
📘 *LinkedIn:* https://www.linkedin.com/company/taskai-studio
🐦 *Twitter:* https://twitter.com/taskai_studio
📸 *Instagram:* https://www.instagram.com/taskai.studio

*🌟 Join our community for:*
• 📚 Productivity tips
• 🚀 New feature announcements
• 💡 Success stories
• 🎯 Motivation & inspiration

📌 Type *0* for main menu`;
        break;

      default:
        responseMessage = `❓ *Invalid Selection*

Hello ${userName}! 👋

Please choose a number from *0-9* to continue.

*💡 Quick Help:*
• Type *0* to see the menu
• Type *menu* or *help* anytime

📌 Let's try again! What would you like to do?`;
        break;
    }

    await sendMessageWithDelay(chatId, responseMessage);

  } catch (error) {
    console.error('Error in handleMenuSelection:', error);
    await sendMessageWithDelay(chatId, `❌ *Something went wrong*

Please try again or contact support if the issue persists.

📌 Type *0* to return to main menu.`);
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
      `🚫 *Too Many Failed Attempts*\n\nPlease wait ${timeLeft} minutes before trying again.\n\n💡 *Need help?* Contact support at taskai.studio@gmail.com`
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
            `🎉 *Welcome to TaskAI Studio!*\n\nHello ${user.name || 'Friend'}! 👋\n\n✅ Successfully connected to WhatsApp!\n🔔 You'll now receive task reminders\n📱 Access all features through this chat\n\n*Let me show you what you can do...*`
          );

          // Send menu after a brief delay
          setTimeout(async () => {
            await sendMenu(message.from);
          }, 3000);

        } catch (err) {
          console.error('❌ Subscription failed:', err.message);
          recordFailedAttempt(number);
          const remaining = getRemainingAttempts(number);

          let errorMsg = `❌ *Connection Failed*\n\n`;

          if (err.message.includes('not found') || err.message.includes('invalid')) {
            errorMsg += `🔑 Invalid secret code. Please check and try again.\n\n`;
          } else {
            errorMsg += `⚠️ Unable to connect right now. Please try again.\n\n`;
          }

          errorMsg += `*Format:* secret code: your-24-digit-code\n`;
          errorMsg += `*Example:* secret code: 507f1f77bcf86cd799439011\n\n`;

          if (remaining > 0) {
            errorMsg += `⏳ ${remaining} attempts remaining`;
          } else {
            errorMsg += `🚫 No more attempts. Please wait 10 minutes.`;
          }

          await sendMessageWithDelay(message.from, errorMsg);
        }
      } else {
        // Secret code format is altered
        await sendMessageWithDelay(message.from, `🔑 *Secret code altered, try again*`);
      }
    }
    // Bot will NOT respond to any other messages from unregistered users
  }

  else {
    // Handle registered user interactions
    if (contentLower === 'logout' || contentLower === 'disconnect') {
      pendingConfirmations.add(number);
      await sendMessageWithDelay(message.from,
        `🚪 *Logout Confirmation*\n\nAre you sure you want to disconnect from TaskAI Studio?\n\n• You'll stop receiving reminders\n• You'll need your secret code to reconnect\n\nType *confirm* to logout or *0* to return to menu.`
      );

    } else if (contentLower === 'confirm') {
      if (pendingConfirmations.has(number)) {
        removeWhatsappSubscriber(number);
        registeredUsers.delete(number);
        pendingConfirmations.delete(number);
        console.log(`🔌 User ${number} logged out successfully`);
        await sendMessageWithDelay(message.from,
          `👋 *Successfully Logged Out*\n\nThank you for using TaskAI Studio!\n\n*To reconnect anytime:*\nsecret code: your-24-digit-code\n\n*Stay productive!* 🎯\nwww.taskai.studio`
        );
      } else {
        await sendMessageWithDelay(message.from,
          `⚠️ *Logout not initiated*\n\nPlease type *logout* or *disconnect* first to confirm logout.`
        );
      }

    } else if (/^secret code\s*:\s*\w+/i.test(content)) {
      await sendMessageWithDelay(message.from,
        `ℹ️ *Already Connected*\n\nYou are already connected to TaskAI Studio.\n\nIf you want to switch accounts, type *logout* first.`
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
          
          await sendMessageWithDelay(message.from, `🤖 *AI Task Analysis Complete*

*Your Task:* "${content}"

*🔍 AI Analysis Results:*
• 🎯 Intent: ${witres.intent || 'Not detected'}
• 📅 Date/Time: ${witres.datetime || 'Not specified'}  
• ⭐ Priority: ${witres.priority || 'Not specified'}
• 📋 Task Type: ${witres.taskType || 'General task'}

*💡 Tips:*
• Visit www.taskai.studio to save this task
• Add more details for better AI recognition

📌 Type *0* for main menu or *7* to analyze another task`);
          return; // Exit early to prevent other message handling
          
        } catch (error) {
          console.error('Error with Wit AI analysis:', error);
          await sendMessageWithDelay(message.from, `❌ *AI Analysis Failed*

Sorry, I couldn't analyze your task right now.

*Your Task:* "${content}"

*Please try:*
• Try again with option *7*
• Visit www.taskai.studio to add manually
• Contact support if issue persists

📌 Type *0* for main menu`);
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