import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  status?: number;
}

export function errorMiddleware(
  err: CustomError,
  _: Request,
  res: Response,
  __: NextFunction
) {
  if (err.status) {
    res.status(err.status).json({ status: 'fail', message: err.message });
  } else {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
}
