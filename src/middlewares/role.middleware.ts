import { NextFunction, Response, Request } from 'express';
import { ErrorHandler } from '@Error/index';
import HTTP_CODES from 'http-status-codes';
import { UserRole } from '@Interfaces/user.interface';
import { AuthRequest } from '@Interfaces/authRequest.interface';

/**
 * @param  {UserRole[]} roles Roles authorized
 */
export const AuthRoleGuard = (roles: UserRole[]) => (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    if (!req.user) {
        return next(new ErrorHandler(HTTP_CODES.UNAUTHORIZED, 'UnAuthorized'));
    }
    if (!roles.includes((req as AuthRequest).user.role)) {
        return next(new ErrorHandler(HTTP_CODES.FORBIDDEN, 'No permission'));
    }
    next();
};
