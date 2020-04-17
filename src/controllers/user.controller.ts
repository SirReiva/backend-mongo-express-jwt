import { Request, Response } from "express";
import { BAD_REQUEST, CREATED, NOT_FOUND } from 'http-status-codes';
import { ErrorHandler } from '../error';
import { createRefeshToken, createToken, checkToken } from '../middlewares/auth.middleware';
import UserModel from '../schemas/user.schema';

export const signUp = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
        throw new ErrorHandler(BAD_REQUEST, 'bad request');
    const results = await UserModel.find({
        $or: [
            { email },
            { name }
        ]
    });
    if (results.length > 0)
        throw new ErrorHandler(BAD_REQUEST, 'Name or Email already in use');
    const newUser = new UserModel({
        email,
        name,
        password
    });
    await newUser.save();
    return res.status(CREATED).json(newUser);
};

export const signIn = async (req: Request, res: Response) => {
    const { name, password } = req.body;
    if (!name || !password)
        throw new ErrorHandler(BAD_REQUEST, 'bad request');
    const user = await UserModel.findOne({
        name
    });
    if (!user) throw new ErrorHandler(BAD_REQUEST, 'Wrong credentials');
    
    if (await user.comparePassword(password)) {
        return res.json({ token: createToken(user), refreshToken: createRefeshToken(user) });
    }
    throw new ErrorHandler(BAD_REQUEST, 'Wrong credentials');
};

export const reSignIn = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const payload: any = await checkToken(refreshToken);
    if(!payload) throw new ErrorHandler(BAD_REQUEST, 'Wrong refesh token');
    const user = await UserModel.findOne({
        $and: [
            { email: payload.email },
            { name: payload.name },
            { _id: payload.id }
        ]
    });
    if (!user) throw new ErrorHandler(BAD_REQUEST, 'Wrong refesh token');
    return res.json({ token: createToken(user), refreshToken: createRefeshToken(user) });
};

export const getAll = async (req: Request, res: Response) => {
    res.json(await UserModel.paginate());
};

export const getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (id === undefined) throw new ErrorHandler(NOT_FOUND, 'User not found');
    const user = await UserModel.findById(id);
    if(user) return res.json(user);
    throw new ErrorHandler(NOT_FOUND, 'User not found');
};