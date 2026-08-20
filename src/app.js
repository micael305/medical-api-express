import express from 'express';
import routes from './routes/index.js';
import loggerMiddleware from './middlewares/logger.js';
import errorHandler from './middlewares/errorhandler.js';

const app = express();

app.use(express.json());
app.use(loggerMiddleware);
app.use('/api', routes);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use(errorHandler);

export default app;