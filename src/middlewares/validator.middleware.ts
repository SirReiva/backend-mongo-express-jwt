import { Request, Response, NextFunction } from 'express';
import { IValidatorFn } from '@Interfaces/validatorFn.interface';

export const ValidationGuard = (...validatorfns: IValidatorFn[]) => (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        validatorfns.forEach((fn) => fn(req.body));
    } catch (error) {
        next(error);
    }
};
