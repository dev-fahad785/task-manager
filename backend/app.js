import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import corsOptions from './config/corsOptions.js';
import errorHandler from './middleware/errorHandler.js';

// Import Routes
import userRoutes from './routes/user.routes.js';
import taskRoutes from './routes/task.routes.js';
import aiSuggestions from './routes/aiSuggestions.routes.js';
import whatsapp from './routes/whatsapp.routes.js';
import adminRoutes from './routes/admin.routes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// Routes
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello from the server!' });
});

app.get('/health', (req, res) => {
    res.status(200).json({ message: 'Server is healthy!' });
});

app.use('/user', userRoutes);
app.use('/task', taskRoutes);
app.use('/aiSuggestion', aiSuggestions);
app.use('/whatsapp', whatsapp);
app.use('/admin', adminRoutes);

// Error Handling
app.use(errorHandler);

export default app;
