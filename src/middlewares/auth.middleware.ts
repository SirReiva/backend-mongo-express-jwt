import { NextFunction, Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import config from '@Config/index';
import UserModel, { IUserSchema } from '@Schemas/user.schema';
import { UNAUTHORIZED } from 'http-status-codes';
import { ErrorHandler } from '@Error';

export interface AuthRequest extends Request {
    user: IUserSchema;
}

/**
 * @param  {string} token Token to check
 */
export const checkToken = (token: string) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, config.JWTSECRET, (err, decoded) => {
            if (err) return resolve(null);
            return resolve(decoded);
        });
    });
};

/**
 * @param  {IUserSchema} user User Schema to generate auth token
 * @returns string
 */
export const createToken = function (user: IUserSchema): string {
    const jwtOps: SignOptions = {
        expiresIn: config.JWT_EXPIRATION,
    };
    return jwt.sign({ ...user.toJSON() }, config.JWTSECRET, jwtOps);
};

/**
 * @param  {IUserSchema} user User Schema to generate refresh token
 * @returns string
 */
export const createRefeshToken = function (user: IUserSchema): string {
    const jwtOps: SignOptions = {
        expiresIn: config.JWT_EXPIRATION_REFRESH,
    };
    return jwt.sign({ ...user.toJSON() }, config.JWTSECRET, jwtOps);
};

/**
 * @param  {Request} req http request
 * @param  {Response} res http response
 * @param  {NextFunction} next Function to continue
 */
export const AuthJWTGuard = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = (req.get('Authorization') || '').replace('Bearer ', '');
    if (!token) {
        return next(new ErrorHandler(UNAUTHORIZED, 'UnAuthorized'));
    }
    const payload: any = await checkToken(token);
    if (!payload) {
        return next(new ErrorHandler(UNAUTHORIZED, 'UnAuthorized'));
    }
    const user = await UserModel.findOne({
        $and: [{ name: payload.name }, { _id: payload.id }],
    });
    if (!user) {
        return next(new ErrorHandler(UNAUTHORIZED, 'UnAuthorized'));
    }
    (req as AuthRequest).user = user;
    next();
};
