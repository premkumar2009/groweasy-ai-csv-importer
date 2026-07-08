import { ErrorRequestHandler } from 'express';
import { MulterError } from 'multer';

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const message = error instanceof Error ? error.message : 'Unexpected server error.';
  if (error instanceof MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      res.status(413).json({
        success: false,
        message: 'CSV file is too large. Maximum size is 10 MB.',
      });
      return;
    }

    res.status(400).json({
      success: false,
      message: error.message,
    });
    return;
  }

  const statusCode = message.includes('allowed') || message.includes('required') || message.includes('empty') ? 400 : 500;

  res.status(statusCode).json({
    success: false,
    message,
  });
};