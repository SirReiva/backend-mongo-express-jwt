import { Request, Response, NextFunction, RequestHandler } from 'express';
import UserModel from '@Schemas/user.schema';
import { UNAUTHORIZED } from 'http-status-codes';

/**
 * @param  {Request} req http request
 */
const extractBasicAuth = (req: Request) => {
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [name, password] = Buffer.from(b64auth, 'base64')
        .toString()
        .split(':');
    return {
        name,
        password,
    };
};

/**
 * @param  {string} name
 * @param  {string} password
 */
const checkBasicUser = async (name: string, password: string) => {
    try {
        const user = await UserModel.findOne({
            name,
        });
        return user && (await user.comparePassword(password));
    } catch (error) {
        return false;
    }
};

/**
 * @param  {Response} res http response
 */
const respondRequiredAuth = (res: Response) => {
    res.setHeader('WWW-Authenticate', 'Basic realm="cms"');
    res.status(UNAUTHORIZED).send('Unauthorized');
};

/**
 * @param  {Request} req http request
 * @param  {Response} res http response
 * @param  {NextFunction} next Function to continue
 */
export const BasicAuthGuard = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { name, password } = extractBasicAuth(req);
    if (await checkBasicUser(name, password)) {
        next();
    } else {
        respondRequiredAuth(res);
    }
};

/**
 * @param  {RequestHandler} middleware to envolve
 */
export const BasicAuthGuardWrapper = (middleware: RequestHandler) => async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { name, password } = extractBasicAuth(req);
    if (await checkBasicUser(name, password)) {
        middleware(req, res, next);
    } else {
        respondRequiredAuth(res);
    }
};
