import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import app from './app.js';
import './whatsapp.bot.js'; // Keep the bot running

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
