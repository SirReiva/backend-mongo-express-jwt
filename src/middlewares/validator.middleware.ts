import { Request, Response, NextFunction, RequestHandler } from 'express';
import { IValidatorFn } from '@Interfaces/validatorFn.interface';

/**
 * @param  {IValidatorFn[]} ...validator functions
 */
export const ValidationGuard = (
    ...validatorfns: IValidatorFn[]
): RequestHandler => async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        for (const fn of validatorfns) {
            await fn(req.body);
        }
        next();
    } catch (error) {
        next(error);
    }
};
