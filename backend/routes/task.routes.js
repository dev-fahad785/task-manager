import express from 'express'


import { 
  addTask, 
  getAllTasks, 
  deleteTask, 
  updateTask, 
  updateTaskStatus, 
  getTodayTasks, 
  getTomorrowTasks, 
  getUpcomingTasks, 
  getTasksCount,
  rescheduleTask,
  createRecurringTask,
  updateRecurrence,
  stopRecurrence,
  getRecurringTasks,
  checkAndGenerateRecurringTasks
} from '../controllers/task.controller.js'
import { get } from 'mongoose';

import { authorizeRoles } from '../middleware/authorizeRole.js';
import { authenticate } from '../middleware/auth.js';



const router = express.Router();

router.post('/addTask',authenticate,authorizeRoles('user','guest'), addTask)
router.get('/getAllTasks/:id', authenticate,authorizeRoles('user','guest'),getAllTasks)//fetch all the tasks of the specific user on the basis of user id
router.delete('/deleteTask/:id', authenticate,authorizeRoles('user','guest'),deleteTask)
router.put('/updateTask', authenticate,authorizeRoles('user','guest'),updateTask)
router.post('/updateTaskStatus',authenticate,authorizeRoles('user','guest'), updateTaskStatus)
router.get('/getTodayTasks/:id', authenticate,authorizeRoles('user','guest'),getTodayTasks) // Assuming this is the same as getAllTasks for today
router.get('/getTomorrowTasks/:id',authenticate,authorizeRoles('user','guest'), getTomorrowTasks) // Assuming this is the same as getAllTasks for tomorrow    
router.get('/getUpcomingTasks/:id', authenticate,authorizeRoles('user','guest'),getUpcomingTasks)
router.get('/getTasksCount', getTasksCount) // Assuming this is the same as getAllTasks for upcoming tasks
router.patch('/rescheduleTask', authenticate,authorizeRoles('user','guest'), rescheduleTask)

// Recurring task routes
router.post('/createRecurringTask', authenticate, authorizeRoles('user','guest'), createRecurringTask)
router.put('/updateRecurrence', authenticate, authorizeRoles('user','guest'), updateRecurrence)
router.post('/stopRecurrence', authenticate, authorizeRoles('user','guest'), stopRecurrence)
router.get('/getRecurringTasks/:id', authenticate, authorizeRoles('user','guest'), getRecurringTasks)
export default router;