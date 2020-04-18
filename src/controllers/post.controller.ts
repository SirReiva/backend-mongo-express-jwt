import { AuthRequest } from '../middlewares/auth.middleware';
import { Response, Request } from 'express';
import PostModel from '../schemas/post.schema';
import { ErrorHandler } from '../error/index';
import { NOT_FOUND, FORBIDDEN, CREATED } from 'http-status-codes';
import { PostService } from '../services/post.service';

export const createPost = async (req: AuthRequest, res: Response) => {
    res.status(CREATED).json(await PostService.createPost(req.body, req.user.id));
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
    res.json(await PostService.getPublicPostById(id));
};

export const getPublicPostsByUserId = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { id } = req.params;
    res.json(await PostService.getPublicPostsByUserId(id, page, limit));
};

export const getPrivatePostsByUserId = async (req: AuthRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { id } = req.params;
    res.json(await PostService.getPrivatePostsByUserId(req.user, id, page, limit));
};

export const getPostBySlug = async (req: Request, res: Response) => {
    const { slug } = req.params;
    res.json(await PostService.getPostBySlug(slug));
};