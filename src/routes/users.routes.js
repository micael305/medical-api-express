import 'dotenv/config';
import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Role } from '../../generated/prisma/client.ts';
import { validateUser } from '../utils/validation.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient({
    adapter: new PrismaPg({
        connectionString: process.env.DATABASE_URL
    })
});
const usersFilePath = path.join(process.cwd(), 'users.json');

router.get('/', (req, res) => {
    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Error con conexión de datos' });
        res.json(JSON.parse(data));
    });
});

router.post('/', (req, res) => {
    const newUser = req.body;
    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Error con conexión de datos' });

        const users = JSON.parse(data);
        const validation = validateUser(newUser, users);
        if (!validation.isValid) return res.status(400).json({ error: validation.errors });

        users.push(newUser);
        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) return res.status(500).json({ error: 'Error al guardar usuario' });
            res.status(201).json(newUser);
        });
    });
});

router.put('/:id', (req, res) => {
    const userID = parseInt(req.params.id, 10);
    const updatedUser = req.body;

    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Error con conexión de datos' });

        const users = JSON.parse(data);
        const userIndex = users.findIndex(user => user.id === userID);
        if (userIndex === -1) return res.status(404).json({ error: `Usuario con ID ${userID} no encontrado` });

        const userToValidate = { ...users[userIndex], ...updatedUser, id: userID };
        const validation = validateUser(userToValidate, users.filter(user => user.id !== userID), 'put');
        if (!validation.isValid) return res.status(400).json({ error: validation.errors });

        users[userIndex] = userToValidate;
        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) return res.status(500).json({ error: 'Error al actualizar usuario' });
            res.json(users[userIndex]);
        });
    });
});

router.delete('/:id', (req, res) => {
    const userID = parseInt(req.params.id, 10);

    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Error con conexión de datos' });

        let users = JSON.parse(data);
        users = users.filter(user => user.id !== userID);

        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) return res.status(500).json({ error: 'Error al eliminar usuario' });
            res.status(204).send();
        });
    });
});

router.get('/db-users', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        console.error('DB_ERROR:', error);
        res.status(500).json({ error: error.message || 'Error al comunicarse con la base de datos' });
    }
});

export default router;