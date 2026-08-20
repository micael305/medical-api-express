import { Router } from 'express';
import authenticateToken from '../middlewares/auth.js';
import { getUsers, getUser, update, remove } from '../controllers/usersController.js';

const router = Router();

router.use(authenticateToken);
router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;