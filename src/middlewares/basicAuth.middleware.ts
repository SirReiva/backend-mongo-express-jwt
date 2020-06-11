import { Request, Response, NextFunction } from 'express';
import UserModel from '@Schemas/user.schema';

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
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="cms"');
        res.end('Unauthorized');
    }
};
