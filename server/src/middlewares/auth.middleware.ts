import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ValidationErrorItemOrigin } from 'sequelize';

const authMiddleware = (req:Request,res:Response,next:NextFunction):void => {
    const token = req.header('Authorization')?.split(' ')[1];

    if(!token){
         res.status(401).json({message : 'Access denied'})
         return
    }

    try {
        let decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        (req as any).user = decoded;
        next()
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

export default authMiddleware;