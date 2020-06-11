import { Request, Response, NextFunction, RequestHandler } from 'express';
import { IValidatorFn } from '@Interfaces/validatorFn.interface';

export const ValidationGuard = (
    ...validatorfns: IValidatorFn[]
): RequestHandler => (req: Request, res: Response, next: NextFunction) => {
    try {
        validatorfns.forEach((fn) => fn(req.body));
    } catch (error) {
        next(error);
    }
};
