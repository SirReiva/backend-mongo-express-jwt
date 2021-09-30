import { AuthRequest } from '@Interfaces/authRequest.interface';
import { UserService } from '@Services/user.service';
import { Request, Response } from 'express';
import HTTP_CODES from 'http-status-codes';

export class UserController {
	static async signUp(req: Request, res: Response): Promise<void> {
		const { name, email, password, role } = req.body;
		res
			.status(HTTP_CODES.CREATED)
			.json(
				await UserService.createUser(name, email, password, role, req.user)
			);
	}

	static async signIn(req: Request, res: Response): Promise<void> {
		const { name, password } = req.body;
		res.json(await UserService.signIn(name, password));
	}

	static async reSignIn(req: Request, res: Response): Promise<void> {
		const { refreshToken } = req.body;
		res.json(await UserService.refreshToken(refreshToken));
	}

	static async getAll(req: Request, res: Response): Promise<void> {
		const page = parseInt(req.query.page as string) || 1;
		const limit = parseInt(req.query.limit as string) || 10;
		res.json(await UserService.findAll(page, limit));
	}

	static async getById(req: Request, res: Response): Promise<void> {
		const { id } = req.params;
		res.json(await UserService.getById(id));
	}

	static async update(req: AuthRequest, res: Response): Promise<void> {
		const { id } = req.params;
		res.json(await UserService.update(id, req.body, req.user));
	}
}
