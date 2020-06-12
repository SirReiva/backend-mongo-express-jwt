import { AuthRequest } from '@Interfaces/authRequest.interface';
import { UserService } from '@Services/user.service';
import { Request, Response } from 'express';
import { CREATED } from 'http-status-codes';

export class UserController {
    static async signUp(req: Request, res: Response) {
        const { name, email, password, role } = req.body;
        return res
            .status(CREATED)
            .json(
                await UserService.createUser(
                    name,
                    email,
                    password,
                    role,
                    req.user
                )
            );
    }

    static async signIn(req: Request, res: Response) {
        const { name, password } = req.body;
        res.json(await UserService.signIn(name, password));
    }

    static async reSignIn(req: Request, res: Response) {
        const { refreshToken } = req.body;
        res.json(await UserService.refreshToken(refreshToken));
    }

    static async getAll(req: Request, res: Response) {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        res.json(await UserService.findAll(page, limit));
    }

    static async getById(req: Request, res: Response) {
        const { id } = req.params;
        res.json(await UserService.getById(id));
    }

    static async update(req: AuthRequest, res: Response) {
        const { id } = req.params;
        res.json(await UserService.update(id, req.body, req.user));
    }
}
