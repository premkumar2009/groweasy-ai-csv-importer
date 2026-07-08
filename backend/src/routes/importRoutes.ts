import { Router } from 'express';
import { importCsvController } from '../controllers/importController.js';
import { importRateLimiter } from '../middlewares/rateLimiter.js';
import { csvUpload } from '../middlewares/upload.js';

export const importRouter = Router();

importRouter.post('/', importRateLimiter, csvUpload.single('file'), importCsvController);