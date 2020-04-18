import { Request, Response } from "express";
import { CREATED } from 'http-status-codes';
import { UserService } from "../services/user.service";

export const signUp = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    return res.status(CREATED).json(await UserService.createUser(name, email, password));
};

export const signIn = async (req: Request, res: Response) => {
    const { name, password } = req.body;
    res.json(await UserService.signIn(name, password));
};

export const reSignIn = async (req: Request, res: Response) => {
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