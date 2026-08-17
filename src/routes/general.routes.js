import { Router } from 'express';
import authenticateToken from '../middlewares/auth.js';

const router = Router();
const PORT = process.env.PORT || 3000;

router.get('/', (req, res) => {
    res.send(`
        <h1>ExpressJS</h1>
        <p>Esta es un aplicación node.js con express.js</p>
        <p>Corre en el puerto ${PORT}</p>`);
});

router.get('/search', (req, res) => {
    const terms = req.query.termino || 'No especificado';
    const category = req.query.categoria || 'Todas';

    res.send(`
        <h2>Resultados de busqueda</h2>
        <p>Termino: ${terms}</p>
        <p>Categoria: ${category}</p>
    `);
});

router.post('/form', (req, res) => {
    const name = req.body.nombre || 'Anónimo';
    const email = req.body.email || 'No especificado';
    res.json({
        message: 'Datos recibidos',
        data: {
            name,
            email
        }
    });
});

router.post('/api/data', (req, res) => {
    const data = req.body;

    if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({ error: 'No se recibieron datos' });
    }

    res.status(201).json({
        message: 'Datos json recibidos',
        data
    });
});

//para simular error en desarrollo
router.get('/error', (req, res, next) => {
    next(new Error('Error intencional'));
});

//probar auth
router.get('/protected-route', authenticateToken, (req, res) => {
    res.send('Esta es una ruta protegida.');
});

export default router;