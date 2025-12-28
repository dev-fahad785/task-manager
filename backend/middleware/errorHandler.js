const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    const status = err.statusCode || 500;
    const message = err.message || 'Server Error';

    res.status(status).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

export default errorHandler;
