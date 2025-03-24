// src/middlewares/logger.middleware.ts
import { Request, Response, NextFunction } from 'express';

const loggerMiddleware = (req: Request, _res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
};

export default loggerMiddleware;
