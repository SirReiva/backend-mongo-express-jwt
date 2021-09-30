import { ErrorHandler } from '@Error/index';
import UserModel from '@Schemas/user.schema';
import { checkToken } from '@Utils/token';
import { NextFunction, Request, Response } from 'express';
import HTTP_CODES from 'http-status-codes';

/**
 * @param  {Request} req http request
 * @param  {Response} res http response
 * @param  {NextFunction} next Function to continue
 */
export const AuthJWTGuard = async (
	req: Request,
	_res: Response,
	next: NextFunction
) => {
	const token = (req.get('Authorization') || '').replace('Bearer ', '');
	if (!token) {
		return next(new ErrorHandler(HTTP_CODES.UNAUTHORIZED, 'UnAuthorized'));
	}
	const payload: any = await checkToken(token);
	if (!payload) {
		return next(new ErrorHandler(HTTP_CODES.UNAUTHORIZED, 'UnAuthorized'));
	}
	const user = await UserModel.findOne({
		$and: [{ name: payload.name }, { _id: payload.id }],
	});
	if (!user) {
		return next(new ErrorHandler(HTTP_CODES.UNAUTHORIZED, 'UnAuthorized'));
	}
	req.user = user;
	next();
};
