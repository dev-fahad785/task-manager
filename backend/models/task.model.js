import mongoose from 'mongoose';

const taskSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    estTime: {
        type: Number,
    },
    dueDate: {
        type: String,
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High", "Urgent","low","medium","high",],
        default: 'Low',
    },
    completionStatus:{
        type:String,
        enum:["Pending","Completed","Overdue"],
        default:"Pending"
    },
    // Recurrence configuration
    recurrence: {
        enabled: { type: Boolean, default: false },
        pattern: {
            type: String,
            enum: ['daily', 'weekly', 'monthly', 'yearly'],
        },
        interval: { type: Number, default: 1 }, // e.g., every 2 days, every 3 weeks
        daysOfWeek: [{ type: Number, min: 0, max: 6 }], // 0=Sunday, 6=Saturday (for weekly)
        dayOfMonth: { type: Number, min: 1, max: 31 }, // for monthly (null = last day)
        monthOfYear: { type: Number, min: 1, max: 12 }, // for yearly
        endDate: { type: String }, // optional: stop recurring after this date
        nextOccurrence: { type: String }, // next date to generate task
    },
    // Tracking for generated instances
    isRecurringInstance: { type: Boolean, default: false }, // marks generated tasks
    parentRecurringTaskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' }, // link to template

}, { timestamps: true });
const Task = mongoose.model('Task', taskSchema);
export default Task;