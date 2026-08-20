import * as usersService from '../services/usersService.js';

const getUsers = async (req, res) => {
    try{
        const users = await usersService.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const user = await usersService.getUserById(id);
        res.json(user);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const updatedUser = await usersService.updatedUser(id, req.body);
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try{
        const id = parseInt(req.params.id, 10);
        await usersService.deleteUser(id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export { getUsers, getUser, update, remove };