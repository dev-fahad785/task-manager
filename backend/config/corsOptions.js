const allowedOrigins = [
    'https://task-ai-tau.vercel.app', 
    'http://localhost:5173', 
    'http://www.taskai.studio', 
    'https://www.taskai.studio'
];

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
};

export default corsOptions;
