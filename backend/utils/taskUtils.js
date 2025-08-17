import { convertWitDateToUserTimezone, parseRelativeTimeInTimezone } from '../utils/timezoneUtils.js';
import TaskModel from "../models/task.model.js";
import UserModel from "../models/user.model.js";

export const addTaskFromWhatsapp = async (number, task) => {
  console.log("from controller task", task);
  try {
    const user = await UserModel.findOne({ whatsappNumber: number });
    if (!user) {
      console.log(`User not found for number: ${number}`);
      return;
    }

    // Get user's timezone (fallback to UTC if not set)
    const userTimezone = user.timezone || "UTC";
    console.log(`🌍 User's timezone: ${userTimezone}`);

    // Smart datetime handling
    let finalDateTime = task.datetime;

    if (task.datetime) {
      const originalText = task.text.toLowerCase();

      // Check for specific date patterns (like "23 aug", "august 23", "23/08", "19-aug", etc.)
      const hasSpecificDate =
        /\d{1,2}[-\s]*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december)/i.test(
          originalText
        ) ||
        /\d{1,2}[\/\-]\d{1,2}/i.test(originalText) ||
        /(january|february|march|april|may|june|july|august|september|october|november|december)[-\s]*\d{1,2}/i.test(
          originalText
        );

      // Check for time patterns (AM/PM with optional minutes)
      const hasTimePattern = /\d{1,2}(?::\d{2})?\s*(am|pm)/i.test(originalText);

      // Check for relative time references
      const hasRelativeTime =
        originalText.includes("today") ||
        originalText.includes("tomorrow") ||
        originalText.includes("day after") ||
        originalText.includes("tonight") ||
        originalText.includes("morning") ||
        originalText.includes("afternoon") ||
        originalText.includes("evening");

      if (hasSpecificDate && hasTimePattern) {
        // For specific dates with times (like "23 aug at 7 pm"), parse in user's timezone
        console.log(
          `📅 Detected specific date with time in message: "${task.text}"`
        );
        console.log(`📅 Will parse as user intent in their timezone`);
        finalDateTime = parseRelativeTimeInTimezone(task.text, userTimezone);
        console.log(`📅 Parsed in user timezone: ${finalDateTime}`);
      } else if (hasRelativeTime) {
        // For relative times (today, tomorrow, etc.), parse in user's timezone
        console.log(`📅 Detected relative time in message: "${task.text}"`);
        finalDateTime = parseRelativeTimeInTimezone(task.text, userTimezone);
        console.log(`📅 Parsed in user timezone: ${finalDateTime}`);
      } else {
        // For other absolute dates/times, convert from Wit.ai timezone
        console.log(
          `📅 Using Wit.ai parsed datetime for absolute time: "${task.text}"`
        );
        finalDateTime = convertWitDateToUserTimezone(
          task.datetime,
          userTimezone
        );
        console.log(`📅 Original datetime: ${task.datetime}`);
        console.log(`📅 Converted datetime: ${finalDateTime}`);
      }
    } else {
      // If no specific datetime, try to parse relative time from the original text
      const relativeTime = parseRelativeTimeInTimezone(task.text, userTimezone);
      finalDateTime = relativeTime;
      console.log(`📅 Parsed relative time: ${finalDateTime}`);
    }

    const newTask = new TaskModel({
      user_id: user._id,
      title: task.text,
      description: task.text,
      estTime: 30,
      dueDate: finalDateTime,
      priority: task.priority,
    });

    const savedTask = await newTask.save();
    console.log("saved Task", savedTask);
    user.task_id.push(savedTask._id);
    await user.save();
    return savedTask;
  } catch (error) {
    console.error("❌ Error in addTaskFromWhatsapp:", error);
    return null;
  }
};
