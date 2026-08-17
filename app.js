import 'dotenv/config';
import express from 'express';
import generalRoutes from './src/routes/general.routes.js';
import usersRoutes from './src/routes/users.routes.js';
import LoggerMiddleware from './src/middlewares/logger.js';
import errorHandler from './src/middlewares/errorhandler.js';
import authenticateToken from './src/middlewares/auth.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(LoggerMiddleware);
app.use(errorHandler);
app.use(authenticateToken);

app.use('/', generalRoutes);
app.use('/users', usersRoutes);

app.listen(PORT, () => {
    console.log(`Servidor: http://localhost:${PORT}`);
});