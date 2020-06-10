import { NextFunction, Response, Request } from 'express';
import { AuthRequest } from '@Middlewares/auth.middleware';
import { ErrorHandler } from '@Error';
import { UNAUTHORIZED, FORBIDDEN } from 'http-status-codes';
import { UserRole } from '@Interfaces/user.model';

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
