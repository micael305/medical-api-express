import dotenv from 'dotenv';
import express from 'express';
import generalRoutes from './src/routes/general.routes.js';
import usersRoutes from './src/routes/users.routes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', generalRoutes);
app.use('/users', usersRoutes);

app.listen(PORT, () => {
    console.log(`Servidor: http://localhost:${PORT}`);
});