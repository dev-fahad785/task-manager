import { 
    registeredUsers, 
    userAttempts, 
    pendingConfirmations, 
    waitingForTaskInput,
    MAX_ATTEMPTS,
    BLOCK_DURATION
} from './state.js';
import { sendMessageWithDelay } from './queue.js';
import { sendMenu, handleMenuSelection } from './menu.service.js';
import { addWhatsappSubscriber, removeWhatsappSubscriber } from '../../controllers/user.controller.js';
import { runWitTest } from '../../wit.js';
import { addTaskFromWhatsapp, formatDateForWhatsapp } from '../../utils/taskUtils.js';
import { detectTimezoneFromPhone } from '../../utils/timezoneUtils.js';
import User from '../../models/user.model.js';

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

export const handleIncomingMessage = async (message) => {
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
        
          // Fetch user to get timezone
          const user = await User.findOne({ whatsappNumber: number });
          
          // Auto-detect and save timezone if missing or UTC (lazy update)
          if (user && (!user.timezone || user.timezone === 'UTC')) {
            const detectedZone = detectTimezoneFromPhone(number);
            if (detectedZone && detectedZone !== 'UTC') {
              user.timezone = detectedZone;
              await user.save();
              console.log(`🌍 Lazy-updated timezone for ${number} to ${detectedZone}`);
            }
          }

          const userTimezone = user?.timezone || 'UTC';

          // Send the user's message to Wit AI
          const witres = await runWitTest(content, userTimezone);
          // console.log('Wit AI result:', witres);
          const task = await addTaskFromWhatsapp(number, witres);
          const taskWithFormatedDate=await formatDateForWhatsapp([task])
          
          console.log("task from bot file ", taskWithFormatedDate);

          await sendMessageWithDelay(message.from, `Task Added Successfully
• Task: ${taskWithFormatedDate}



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

};
