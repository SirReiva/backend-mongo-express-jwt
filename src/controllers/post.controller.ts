import { Request, Response } from 'express';
import { CREATED } from 'http-status-codes';
import { PostService } from '@Services/post.service';
import { UpdatePostSchemaValidator } from '@Validators/post.validator';
import { AuthRequest } from '@Interfaces/authRequest.interface';

export const createPost = async (req: AuthRequest, res: Response) => {
    res.status(CREATED).json(
        await PostService.createPost(req.body, req.user.id)
    );
};

export const getAllPublic = async (_req: Request, res: Response) => {
    res.json(await PostService.getPublicPosts());
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

export const getPrivatePostsByUserId = async (
    req: AuthRequest,
    res: Response
) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { id } = req.params;
    res.json(
        await PostService.getPrivatePostsByUserId(req.user, id, page, limit)
    );
};

export const getPostBySlug = async (req: Request, res: Response) => {
    const { slug } = req.params;
    res.json(await PostService.getPostBySlug(slug));
};

export const updatePost = async (req: AuthRequest, res: Response) => {
    UpdatePostSchemaValidator(req.body);
    const { id } = req.params;
    res.json(await PostService.update(id, req.body, req.user));
};

export const deletePost = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    res.json(await PostService.delete(id, req.user));
};
