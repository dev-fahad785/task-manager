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
    }

}, { timestamps: true });
const Task = mongoose.model('Task', taskSchema);
export default Task;