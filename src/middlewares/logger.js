const LoggerMiddleware = (req, res, next) => {
    const timeStamp = new Date().toISOString();

    console.log(`[${timeStamp}] Request: ${req.method} ${req.url} - IP: ${req.ip}`);

    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        const responseTimeStamp = new Date().toISOString();
        console.log(`[${responseTimeStamp}] Response: ${res.statusCode} - ${duration}ms`);
    });

    next();
}

export default LoggerMiddleware;