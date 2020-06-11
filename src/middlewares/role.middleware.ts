import { NextFunction, Response, Request } from 'express';
import { ErrorHandler } from '@Error/index';
import { UNAUTHORIZED, FORBIDDEN } from 'http-status-codes';
import { UserRole } from '@Interfaces/user.interface';
import { AuthRequest } from '@Interfaces/authRequest.interface';

/**
 * @param  {UserRole[]} roles Roles authorized
 */
export const AuthRole = (roles: UserRole[]) => (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.user) {
        return next(new ErrorHandler(UNAUTHORIZED, 'UnAuthorized'));
    }
    if (!roles.includes((req as AuthRequest).user.role)) {
        return next(new ErrorHandler(FORBIDDEN, 'No permission'));
    }
    next();
};
