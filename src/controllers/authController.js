import { registerUser, loginUser } from '../services/authService.js';
import { validateLogin, validateRegistration } from '../utils/validation.js';

const register = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;
        validateRegistration({ email, password, name });
        await registerUser(email, password, name);
        return res.status(201).json({ message: 'User Registered Succefully'});
    } catch (error) {
        next(error);
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        validateLogin({ email, password });
        const token = await loginUser(email, password);
        res.json({token});
    } catch (error) {
        next(error);
    }
}

export { register, login };