import { Router } from 'express';
import userRoutes from './userRoutes.js';
import taskRoutes from './taskRoutes.js';

const router = Router();

router.use('/users', userRoutes);
router.use('/tasks', taskRoutes);

export default router;