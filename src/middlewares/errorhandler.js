const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    const isDevelopment = process.env.NODE_ENV === 'development';

    console.error(`[ERROR] ${new Date().toISOString()} - ${statusCode} - ${message}`);

    if (err.stack) {
        console.error(err.stack);
    }

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
        ...(isDevelopment && err.errors && { errors: err.errors }),
        ...(isDevelopment && { stack: err.stack })
    })

};

export default errorHandler;