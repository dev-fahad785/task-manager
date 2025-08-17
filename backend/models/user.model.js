import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "guest"], // allowed values
        default: "user",
        required: true,
    },

    dailyScore: {
        type: Number,
    },
    weeklyScore: {
        type: Number,
    },
    monthlyScore: {
        type: Number,
    },
    task_id: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task',
        }
    ],
    //rate limiting for ai requests
    rateLimit: {
        count: { type: Number, default: 0 },
        lastReset: { type: String, default: () => new Date().toISOString().slice(0, 10) },
        maxPerDay: { type: Number, default: 10 },
        totalRequests: { type: Number, default: 0 },
    },
    whatsappNumber: {
        type: String,
        required: false,
    },
    timezone: {
        type: String,
        required: false,
        default: 'UTC', // Default to UTC if not specified
    },
    // Store user's approximate location for timezone detection
    location: {
        country: { type: String, required: false },
        city: { type: String, required: false },
    }




}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;