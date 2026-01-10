import { sendMessageWithDelay } from './queue.js';
import { waitingForTaskInput } from './state.js';
import { getTodaysTasks, getTomrrowsTasks, getUpcomingTasks, getAllTasks, productivityReport } from '../../whatsappBot/whatsappBot.controller.js';
import { formatDateForWhatsapp } from '../../utils/taskUtils.js';

// Enhanced menu function
export const sendMenu = async (chatId) => {
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

// Enhanced menu selection handler
export const handleMenuSelection = async (chatId, selection, userName, number) => {
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
            const taskList = await formatDateForWhatsapp(allTasks);

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
