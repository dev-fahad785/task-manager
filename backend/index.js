import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';



import { connectDB } from './config/db.js'
import userRoutes from './routes/user.routes.js';
import taskRoutes from './routes/task.routes.js';
import aiSuggestions from './routes/aiSuggestions.routes.js'
import whatsapp from './routes/whatsapp.routes.js'
import adminRoutes from './routes/admin.routes.js';


dotenv.config();
const app = express();
app.use(express.json())
connectDB();

app.use(cookieParser());
const allowedOrigins = ['https://task-ai-tau.vercel.app', 'http://localhost:5173', 'http://www.taskai.studio', 'https://www.taskai.studio']
const corsOptions = {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    credentials: true,
}

app.use(cors(corsOptions));



app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello from the server!' });
})
app.get('/health', (req, res) => {
    res.status(200).json({ message: 'Server is healthy!' });
})

app.use('/user', userRoutes);
app.use('/task', taskRoutes)
app.use('/aiSuggestion', aiSuggestions)
app.use('/whatsapp', whatsapp)
app.use('/admin',adminRoutes)


const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});

export default app;
