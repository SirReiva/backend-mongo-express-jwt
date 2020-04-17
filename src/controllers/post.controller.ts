import { AuthRequest } from '../middlewares/auth.middleware';
import { Response, Request } from 'express';
import PostModel from '../schemas/post.schema';
import { ErrorHandler } from '../error/index';
import { NOT_FOUND } from 'http-status-codes';

export const createPost = async (req: AuthRequest, res: Response) => {
    const post = new PostModel({
        ...req.body,
        author: req.user.id,
        isPublic: false
    });
    await post.save();
    res.json(await post.populate('author').execPopulate());
};

export const getAllPublic = async (req: Request, res: Response) => {
    res.json(await PostModel.paginate({
        isPublic: true
    }, {
        populate: 'author',
    }));
};

export const getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (id === undefined) throw new ErrorHandler(NOT_FOUND, 'User not found');
    const user = await PostModel.findById(id).populate('author');
    if(user) return res.json(user);
    throw new ErrorHandler(NOT_FOUND, 'User not found');
};

export const getPublicPostsByUserId = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { id } = req.params;
    res.send(await PostModel.paginate({
        author: id,
        public: true
    }, {
        populate: 'author',
        page,
        limit
    }));
};

export const getPostBySlug = async (req: Request, res: Response) => {
    const { slug } = req.params;
    const post = await PostModel.findOne({
        slug
    }).populate('author').exec();
    if (!post) throw new ErrorHandler(NOT_FOUND, 'Post not found');
    return res.json(post);
};