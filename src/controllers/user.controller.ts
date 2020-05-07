import { Request, Response } from 'express';
import { CREATED } from 'http-status-codes';
import { UserService } from '../services/user.service';
import {
    CreateUserSchemaValidator,
    SignInUserSchemaValidator,
    ReSignInUserSchemaValidator,
    UpdateserSchemaValidator,
} from '../validators/user.validator';
import { AuthRequest } from '../middlewares/auth.middleware';

export const signUp = async (req: Request, res: Response) => {
    CreateUserSchemaValidator(req.body);
    const { name, email, password, role } = req.body;
    return res
        .status(CREATED)
        .json(
            await UserService.createUser(name, email, password, role, req.user)
        );
};

export const signIn = async (req: Request, res: Response) => {
    SignInUserSchemaValidator(req.body);
    const { name, password } = req.body;
    res.json(await UserService.signIn(name, password));
};

export const reSignIn = async (req: Request, res: Response) => {
    ReSignInUserSchemaValidator(req.body);
    const { refreshToken } = req.body;
    res.json(await UserService.refreshToken(refreshToken));
};

export const getAll = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    res.json(await UserService.findAll(page, limit));
};

export const getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    res.json(await UserService.getById(id));
};

export const update = async (req: AuthRequest, res: Response) => {
    UpdateserSchemaValidator(req.body);
    const { id } = req.params;
    res.json(await UserService.update(id, req.body, req.user));
};
