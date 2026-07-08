import multer from 'multer';
import { hasCsvExtension } from '../utils/csv.js';

const storage = multer.memoryStorage();

export const csvUpload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (_req, file, callback) => {
    const isCsvMime = file.mimetype === 'text/csv' || file.mimetype === 'application/vnd.ms-excel';
    const isCsvName = hasCsvExtension(file.originalname);

    if (!isCsvMime && !isCsvName) {
      callback(new Error('Only CSV files are allowed.'));
      return;
    }

    callback(null, true);
  },
});