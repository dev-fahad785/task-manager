import TaskModel from "../models/task.model.js";
import UserModel from "../models/user.model.js";
import { 
  calculateNextOccurrence, 
  updateRecurrencePattern, 
  stopRecurrence as stopRecurrenceService,
  checkAndGenerateRecurringTasks as checkAndGenerateService 
} from "../services/recurringTask.service.js";

export const getUserTasks = async (userID) => {
  try {
    // Fetch the user from the database
    const user = await UserModel.findById(userID);
    // console.log(user)
    if (!user) throw new Error("User not found");

    // Check if the user has tasks
    if (!user.task_id || user.task_id.length === 0) {
      return []; // No tasks
    }

    // Fetch tasks based on task_ids and completion status
    const tasks = await TaskModel.find({
      _id: { $in: user.task_id },
    });
    // console.log(tasks)

    const now = new Date(); // server time
    const overdueTasks = tasks.filter((task) => {
      const due = new Date(task.dueDate);
      return (
        task.completionStatus === "Pending" && due.getTime() < now.getTime()
      );
    });

    // Update overdue tasks
    await Promise.all(
      overdueTasks.map((task) => {
        task.completionStatus = "Overdue";
        return task.save();
      })
    );

    return tasks;
  } catch (error) {
    // Handle error (e.g., log, or send a specific error message)
    console.error(error);
    throw error; // Re-throw or return a custom error response
  }
};
//it will exclude teh completed and overdue tasks and return only the pending tasks
export const tasksforAIArrangement = async (userID) => {
  try {
    // Fetch the user from the database
    const user = await UserModel.findById(userID);
    // console.log(user)
    if (!user) throw new Error("User not found");

    // Check if the user has tasks
    if (!user.task_id || user.task_id.length === 0) {
      return []; // No tasks
    }

    // Fetch tasks based on task_ids and completion status
    const tasks = await TaskModel.find({
      _id: { $in: user.task_id },
      completionStatus: "Pending",
    });
    // console.log(tasks)

    const now = new Date();

    const overdueTasks = tasks.filter(
      (task) =>
        task.completionStatus === "Pending" && new Date(task.dueDate) < now
    );

    // Update overdue tasks
    await Promise.all(
      overdueTasks.map((task) => {
        task.completionStatus = "Overdue";
        return task.save();
      })
    );

    return tasks;
  } catch (error) {
    // Handle error (e.g., log, or send a specific error message)
    console.error(error);
    throw error; // Re-throw or return a custom error response
  }
};

export const addTask = async (req, res) => {
  const { userID, newTask } = req.body;

  try {
    const user = await UserModel.findById(userID); // Use `findById` for ObjectId lookup

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const task = new TaskModel({
      user_id: user._id,
      title: newTask.title,
      description: newTask.description,
      estTime: newTask.estTime, // Map estimatedTime to estTime
      dueDate: newTask.dueDate,
      priority: newTask.priority,
      recurrence: newTask.recurrence || { enabled: false },
    });

    // If recurrence is enabled, calculate next occurrence
    if (task.recurrence.enabled) {
      const nextOccurrence = calculateNextOccurrence(task);
      if (nextOccurrence) {
        task.recurrence.nextOccurrence = nextOccurrence.toISO();
      }
    }

    const savedTask = await task.save();

    // Push the task ID into user's `tasks` array
    user.task_id.push(savedTask._id);
    await user.save();
    res
      .status(200)
      .json({ message: "Task added successfully", task: savedTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error while saving the task" });
  }
};

export const getAllTasks = async (req, res) => {
  const userID = req.params.id;
  // console.log(userID)
  try {
    const tasks = await getUserTasks(userID); // fetch tasks from DB
    console.log(tasks);
    // console.log(tasks)
    if (!tasks || tasks.length === 0) {
      return res
        .status(404)
        .json({ message: "Can't find tasks for this user" });
    }
    res.status(200).json({ message: "Fetched tasks successfully", tasks });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred while fetching taskss" });
  }
};

export const getTodayTasks = async (req, res) => {
  const userID = req.params.id;
  try {
    const tasks = await getUserTasks(userID); // fetch tasks from DB
    if (!tasks || tasks.length === 0) {
      return res
        .status(404)
        .json({ message: "Can't find tasks for this user" });
    }
    // Filter tasks for today
    const today = new Date();
    const todayTasks = tasks.filter((task) => {
      const dueDate = new Date(task.dueDate);
      return (
        dueDate.getFullYear() === today.getFullYear() &&
        dueDate.getMonth() === today.getMonth() &&
        dueDate.getDate() === today.getDate()
      );
    });
    res.status(200).json({
      message: "Fetched today's tasks successfully",
      tasks: todayTasks,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred while fetching today's tasks" });
  }
};

export const getTomorrowTasks = async (req, res) => {
  const userID = req.params.id;
  try {
    const tasks = await getUserTasks(userID); // fetch tasks from DB
    if (!tasks || tasks.length === 0) {
      return res
        .status(404)
        .json({ message: "Can't find tasks for this user" });
    }
    // Filter tasks for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowTasks = tasks.filter((task) => {
      const dueDate = new Date(task.dueDate);
      return (
        dueDate.getFullYear() === tomorrow.getFullYear() &&
        dueDate.getMonth() === tomorrow.getMonth() &&
        dueDate.getDate() === tomorrow.getDate()
      );
    });
    res.status(200).json({
      message: "Fetched tomorrow's tasks successfully",
      tasks: tomorrowTasks,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred while fetching tomorrow's tasks" });
  }
};

export const getUpcomingTasks = async (req, res) => {
  const userID = req.params.id;
  try {
    const tasks = await getUserTasks(userID); // fetch tasks from DB
    if (!tasks || tasks.length === 0) {
      return res
        .status(404)
        .json({ message: "Can't find tasks for this user" });
    }

    const today = new Date();
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);
    dayAfterTomorrow.setHours(0, 0, 0, 0); // Start of day after tomorrow

    const filteredTasks = tasks.filter((task) => {
      const dueDate = new Date(task.dueDate);
      return dueDate >= dayAfterTomorrow;
    });

    res.status(200).json({
      message:
        "Fetched tasks for the day after tomorrow and ahead successfully",
      tasks: filteredTasks,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred while fetching tasks" });
  }
};

export const deleteTask = async (req, res) => {
  const taskID = req.params.id;
  try {
    const task = await TaskModel.findByIdAndDelete(taskID); // pass the ID directly

    if (!task) {
      return res.status(404).json({ message: "This task does not exist" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};

export const updateTask = async (req, res) => {
  const { taskID, updatedTask } = req.body;

  try {
    const task = await TaskModel.findByIdAndUpdate(
      taskID,
      {
        title: updatedTask.title,
        description: updatedTask.description,
        estTime: updatedTask.estTime,
        priority: updatedTask.priority,
        dueDate: updatedTask.dueDate,
      },
      { new: true } // optional: returns the updated document
    );

    if (!task) {
      return res.status(404).json({ message: "Can't find task" });
    }

    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while updating the task", error });
  }
};

export const updateTaskStatus = async (req, res) => {
  const { taskID, completionStatus } = req.body;
  console.log(completionStatus);
  try {
    const task = await TaskModel.findById(taskID);
    console.log(task);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    task.completionStatus = completionStatus;
    await task.save();
    res.status(200).json({ message: "Task status updated successfully", task });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while updating the task status",
      error,
    });
  }
};

export const getTasksCount = async (req, res) => {
  try {
    const tasks = await TaskModel.find();
    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found" });
    }
    const tasksCount = tasks.length;
    res
      .status(200)
      .json({ message: "Tasks count fetched successfully", tasksCount });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while fetching tasks count",
      error: error.message,
    });
  }
};

export const rescheduleTask = async (req, res) => {
  const { taskID, dueDate } = req.body;
  try {
    const task = await TaskModel.findById(taskID);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    task.dueDate = dueDate;
    task.completionStatus = "Pending";
    await task.save();
    console.log("✅ Task rescheduled successfully");
    return res
      .status(200)
      .json({ message: "Task rescheduled successfully", task });
  } catch (error) {
    console.error("❌ Error rescheduling task:", error);
    return res
      .status(500)
      .json({ message: "Error rescheduling task", error: error.message });
  }
};

// ============= RECURRING TASK CONTROLLERS =============

/**
 * Create a recurring task
 */
export const createRecurringTask = async (req, res) => {
  const { userID, newTask } = req.body;

  try {
    const user = await UserModel.findById(userID);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate recurrence configuration
    if (!newTask.recurrence || !newTask.recurrence.enabled) {
      return res.status(400).json({ message: "Recurrence configuration is required" });
    }

    const task = new TaskModel({
      user_id: user._id,
      title: newTask.title,
      description: newTask.description,
      estTime: newTask.estTime,
      dueDate: newTask.dueDate,
      priority: newTask.priority,
      recurrence: newTask.recurrence,
    });

    // Calculate next occurrence
    const nextOccurrence = calculateNextOccurrence(task);
    if (nextOccurrence) {
      task.recurrence.nextOccurrence = nextOccurrence.toISO();
    } else {
      return res.status(400).json({ message: "Invalid recurrence pattern" });
    }

    const savedTask = await task.save();

    // Push the task ID into user's tasks array
    user.task_id.push(savedTask._id);
    await user.save();

    res.status(200).json({ 
      message: "Recurring task created successfully", 
      task: savedTask 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error while creating recurring task", error: error.message });
  }
};

/**
 * Update recurrence pattern for a task
 */
export const updateRecurrence = async (req, res) => {
  const { taskID, recurrencePattern } = req.body;

  try {
    const updatedTask = await updateRecurrencePattern(taskID, recurrencePattern);
    res.status(200).json({ 
      message: "Recurrence pattern updated successfully", 
      task: updatedTask 
    });
  } catch (error) {
    console.error(error);
    if (error.message === 'Task not found') {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes('Cannot update recurrence')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ 
      message: "Error while updating recurrence pattern", 
      error: error.message 
    });
  }
};

/**
 * Stop recurrence for a task
 */
export const stopRecurrence = async (req, res) => {
  const { taskID } = req.body;

  try {
    const updatedTask = await stopRecurrenceService(taskID);
    res.status(200).json({ 
      message: "Recurrence stopped successfully", 
      task: updatedTask 
    });
  } catch (error) {
    console.error(error);
    if (error.message === 'Task not found') {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes('Cannot stop recurrence')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ 
      message: "Error while stopping recurrence", 
      error: error.message 
    });
  }
};

/**
 * Get all recurring task templates for a user
 */
export const getRecurringTasks = async (req, res) => {
  const userID = req.params.id;

  try {
    const recurringTasks = await TaskModel.find({
      user_id: userID,
      'recurrence.enabled': true,
      isRecurringInstance: false, // Only templates, not instances
    });

    res.status(200).json({ 
      message: "Recurring tasks fetched successfully", 
      tasks: recurringTasks 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: "Error while fetching recurring tasks", 
      error: error.message 
    });
  }
};

/**
 * Check and generate recurring tasks on-demand
 */
export const checkAndGenerateRecurringTasks = async (req, res) => {
  const { userID } = req.body;

  try {
    const generatedCount = await checkAndGenerateService(userID);
    res.status(200).json({ 
      message: "Recurring tasks checked and generated", 
      generatedCount 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: "Error while checking recurring tasks", 
      error: error.message 
    });
  }
};
