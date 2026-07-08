import { Request, Response, NextFunction } from 'express';
import { runCsvImport } from '../services/importService.js';

export async function importCsvController(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'A CSV file is required.' });
    }

    const result = await runCsvImport(req.file);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}