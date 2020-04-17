import { AuthRequest } from '../middlewares/auth.middleware';
import { Response, response, Request } from 'express';
import PostModel from '../schemas/post.schema';
import { ErrorHandler } from '../error/index';
import { NOT_FOUND } from 'http-status-codes';

export const createPost = async (req: AuthRequest, res: Response) => {
    const post = new PostModel({
        ...req.body,
        author: req.user.id
    });
    post.save();
    res.json(await post.populate('author').execPopulate());
};

export const getAll = async (req: Request, res: Response) => {
    res.json(await PostModel.paginate({}, {
        populate: 'author'
    }));
};

export const getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (id === undefined) throw new ErrorHandler(NOT_FOUND, 'User not found');
    const user = await PostModel.findById(id);
    if(user) return res.json(user);
    throw new ErrorHandler(NOT_FOUND, 'User not found');
};

export const getPostsByUserId = async (req: Request, res: Response) => {
    const { id } = req.params;
    res.send(await PostModel.paginate({
        author: id
    }, {
        populate: 'author'
    }));
};