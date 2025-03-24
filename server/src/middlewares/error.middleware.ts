// src/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction):void => {
    console.error('Error:', err);
     res.status(500).json({ message: 'Internal Server Error', error: err.message });
};

export default errorHandler;
