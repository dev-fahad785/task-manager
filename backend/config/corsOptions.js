const envOrigins = process.env.CORS_ALLOWED_ORIGINS
    ? process.env.CORS_ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
    : [];

const defaultOrigins = [
    'https://task-ai-tau.vercel.app',
    'http://localhost:5173',
    'http://0.0.0.0:3000',
    'http://www.taskai.studio',
    'https://www.taskai.studio',
    'http://taskai.studio',
    'https://taskai.studio'
];

const allowedOrigins = Array.from(new Set([...envOrigins, ...defaultOrigins]));

const corsOptions = {
    origin: (origin, callback) => {
        const normalizedOrigin = origin ? origin.replace(/\/$/, '') : origin;
        if (allowedOrigins.indexOf(normalizedOrigin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
};

export default corsOptions;
