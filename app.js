import { error } from 'console';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import path from 'path';

const usersFilePath = path.join(import.meta.dirname, 'users.json');

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`
        <h1>ExpressJS</h1>
        <p>Esta es un aplicación node.js con express.js</p>
        <p>Corre en el puerto ${PORT}</p>`);
})

app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    res.send(`Mostrar información del usuario con ID: ${userId}`);
})

app.get('/search', (req, res) => {
    const terms = req.query.termino || 'No especificado';
    const category = req.query.categoria || 'Todas';

    res.send(`
        <h2>Resultados de busqueda</h2>
        <p>Termino: ${terms}</p>
        <p>Categoria: ${category}</p>
        `);
});

app.post('/form', (req, res) => {
    const name = req.body.nombre || 'Anónimo';
    const email = req.body.email || 'No especificado';
    res.json({
        message: 'Datos recibidos',
        data: {
            name,
            email
        }
    })
});

app.post('/api/data', (req, res) => {
    const data = req.body;

    if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({ error: 'No se recibieron datos' });
    }

    res.status(201).json({
        message: 'Datos json recibidos',
        data
    })
});

app.get('/users', (req, res) => {
    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error con conexión de datos' });
        }
        const users = JSON.parse(data);
        res.json(users);
    });
});

app.post('/users', (req, res) => {
    const newUser = req.body;
    const { name, email } = newUser;

    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: 'El campo "nombre" es obligatorio y debe ser texto válido' });
    }

    if (!email || typeof email !== 'string' || email.trim() === '') {
        return res.status(400).json({ error: 'El campo "email" es obligatorio' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'El formato del email no es válido' });
    }

    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error con conexión de datos' });
        }

        const users = JSON.parse(data);

        users.push(newUser);
        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al guardar usuario' });
            }
            res.status(201).json(newUser);
        });
    });
});

app.put('/users/:id', (req, res) => {
    const userID = parseInt(req.params.id);
    const updateUser = req.body;

    if (!name && !email) {
        return res.status(400).json({
            error: "Debe enviar al menos uno de los campos: name o email",
        });
    }

    if (isNaN(userID)) {
        return res.status(400).json({ error: 'El ID proporcionado debe ser un número válido' });
    }

    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error con conexión de datos' });
        }
        let users = JSON.parse(data);
        const userIndex = users.findIndex(user => user.id === userID);

        if (userIndex === -1) {
            return res.status(404).json({ error: `Usuario con ID ${userID} no encontrado` });
        }

        users[userIndex] = {
            ...users[userIndex],
            ...updateUser,
            id: userID
        };

        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al actualizar usuario' });
            }
            res.json(updateUser);
        });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor: http://localhost:${PORT}`);
})