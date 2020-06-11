import { ErrorHandler } from '@Error/index';
import { AuthRequest } from '@Interfaces/authRequest.interface';
import UserModel from '@Schemas/user.schema';
import { NextFunction, Request, Response } from 'express';
import { UNAUTHORIZED } from 'http-status-codes';
import { checkToken } from '@Token/actions.token';

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
