import { Router } from 'express';
import { importRouter } from './importRoutes.js';

export const router = Router();

router.use('/import', importRouter);