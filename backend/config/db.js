
import mongoose from 'mongoose'

// export const connectDB = async () => {
//     mongoose.connect(process.env.MONGO_URI).then(() => {
//         console.log("Database connected")
//     })
// }

export const connectDB = async () => {
    console.log("🔍 MONGO_URI at runtime:", process.env.MONGO_URI); // Add this line
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log("✅ Database connected");
    }).catch(err => {
        console.log("❌ MongoDB connection error:", err.message);
        process.exit(1);
    });
}
