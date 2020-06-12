import { AuthRequest } from '@Interfaces/authRequest.interface';
import { PostService } from '@Services/post.service';
import { Request, Response } from 'express';
import { CREATED } from 'http-status-codes';

export class PostController {
    static async createPost(req: AuthRequest, res: Response) {
        res.status(CREATED).json(
            await PostService.createPost(req.body, req.user.id)
        );
    }

    static async getAllPublic(req: Request, res: Response) {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        res.json(await PostService.getPublicPosts(page, limit));
    }

    static async getById(req: Request, res: Response) {
        const { id } = req.params;
        res.json(await PostService.getPublicPostById(id));
    }

    static async getPublicPostsByUserId(req: Request, res: Response) {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const { id } = req.params;
        res.json(await PostService.getPublicPostsByUserId(id, page, limit));
    }

    static async getPrivatePostsByUserId(req: AuthRequest, res: Response) {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const { id } = req.params;
        res.json(
            await PostService.getPrivatePostsByUserId(req.user, id, page, limit)
        );
    }

    static async getPostBySlug(req: Request, res: Response) {
        const { slug } = req.params;
        res.json(await PostService.getPostBySlug(slug));
    }

    static async updatePost(req: AuthRequest, res: Response) {
        const { id } = req.params;
        res.json(await PostService.update(id, req.body, req.user));
    }

    static async deletePost(req: AuthRequest, res: Response) {
        const { id } = req.params;
        res.json(await PostService.delete(id, req.user));
    }
}
