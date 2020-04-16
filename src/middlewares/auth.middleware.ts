import { NextFunction, Request, Response } from "express";
import jwt, { SignOptions } from 'jsonwebtoken';
import config from "../config";
import { IUser } from '../models/user.model';
import UserModel, { IUserSchema } from '../schemas/user.schema';
import { UNAUTHORIZED } from "http-status-codes";

const checkToken = (token: string) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, config.JWTSECRET, (err, decoded) => {
            if (err)  return resolve(null);
            return resolve(decoded);
        });
    });
}

export const createToken = function(user: IUserSchema) : string {
    const jwtOps: SignOptions = {
        expiresIn: config.JWTEXPIRATION,
    };
    return jwt.sign({ ...user.toJSON() }, config.JWTSECRET, jwtOps);
};

export const createRefeshToken = function(user: IUserSchema) : string {
    const jwtOps: SignOptions = {
        expiresIn: config.JWTEXPIRATIONREFRESH,
    };
    return jwt.sign({ ...user.toJSON() }, config.JWTSECRET, jwtOps);
};

export interface AuthRequest extends Request {
    user: IUser;
}

export const AuthJWTGuard = async(req: Request, res: Response, next: NextFunction) => {
    const token = (req.get('Authorization') || '').replace('Bearer ', '');
    if (!token) {
        return res.status(UNAUTHORIZED).json({
            status: "error",
            statusCode: "401",
            message: "UnAuthorized"
        });
    }
    const payload: any = await checkToken(token);
    if (!payload) {
        return res.status(UNAUTHORIZED).json({
            status: "error",
            statusCode: "401",
            message: "UnAuthorized Token"
        });
    }
    const user = await UserModel.findOne({
        $and: [
            { email: payload.email },
            { name: payload.name },
            { _id: payload.id }
        ]
    });
    if (!user) {
        return res.status(UNAUTHORIZED).json({
            status: "error",
            statusCode: "401",
            message: "UnAuthorized Token"
        });
    }
    (req as AuthRequest).user = user;
    next();
}