import { Request, Response, NextFunction, RequestHandler } from 'express';
import UserModel from '@Schemas/user.schema';
import { UNAUTHORIZED } from 'http-status-codes';

export const BasicAuthGuard = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [name, password] = Buffer.from(b64auth, 'base64')
        .toString()
        .split(':');

    const user = await UserModel.findOne({
        name,
    });
    if (user && (await user.comparePassword(password))) {
        next();
    } else {
        res.setHeader('WWW-Authenticate', 'Basic realm="cms"');
        res.status(UNAUTHORIZED).send('Unauthorized');
    }
};

export const BasicAuthGuardWrapper = (middleware: RequestHandler) => async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [name, password] = Buffer.from(b64auth, 'base64')
        .toString()
        .split(':');

    const user = await UserModel.findOne({
        name,
    });
    if (user && (await user.comparePassword(password))) {
        middleware(req, res, next);
    } else {
        res.setHeader('WWW-Authenticate', 'Basic realm="cms"');
        res.status(UNAUTHORIZED).send('Unauthorized');
    }
};
