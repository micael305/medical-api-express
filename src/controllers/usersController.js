import * as usersService from '../services/usersService.js';
import { validateUserUpdate } from '../utils/validation.js';

const getUsers = async (req, res, next) => {
    try{
        const users = await usersService.getAllUsers();
        res.json(users);
    } catch (error) {
        next(error);
    }
};

const getUser = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        const user = await usersService.getUserById(id);
        res.json(user);
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        validateUserUpdate(req.body);
        const updatedUser = await usersService.updatedUser(id, req.body);
        res.json(updatedUser);
    } catch (error) {
        next(error);
    }
};

const remove = async (req, res, next) => {
    try{
        const id = parseInt(req.params.id, 10);
        await usersService.deleteUser(id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export { getUsers, getUser, update, remove };