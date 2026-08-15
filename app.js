import { error } from 'console';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { validateUser } from './utils/validation.js';

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

    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error con conexión de datos' });
        }

        const users = JSON.parse(data);
        const validation = validateUser(newUser, users);

        if (!validation.isValid) {
            return res.status(400).json({ error: validation.errors });
        }

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
    const userID = parseInt(req.params.id, 10);
    const updatedUser = req.body;

    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error con conexión de datos' });
        }

        const users = JSON.parse(data);
        const userIndex = users.findIndex(user => user.id === userID);

        if (userIndex === -1) {
            return res.status(404).json({ error: `Usuario con ID ${userID} no encontrado` });
        }

        const userToValidate = {
            ...users[userIndex],
            ...updatedUser,
            id: userID
        };

        const validation = validateUser(userToValidate, users.filter(user => user.id !== userID), 'put');

        if (!validation.isValid) {
            return res.status(400).json({ error: validation.errors });
        }

        users[userIndex] = userToValidate;

        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al actualizar usuario' });
            }
            res.json(users[userIndex]);
        });
    });
});

app.delete('/users/:id', (req, res) => {
    const userID = parseInt(req.params.id, 10);

    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error con conexión de datos' });
        }
    let users = JSON.parse(data);
    users = users.filter(user => user.id !== userID);

    fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
        if (err) {
            return res.status(500).json({error: 'Error al eliminar usuario'});
        }
        res.status(204).send();
    });

    });
});


app.listen(PORT, () => {
    console.log(`Servidor: http://localhost:${PORT}`);
})