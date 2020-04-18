import PostModel, { IPostSchema } from '../schemas/post.schema';
import { ErrorHandler } from '../error/index';
import { NOT_FOUND, FORBIDDEN } from 'http-status-codes';
import { UserRole, IUser } from '../models/user.model';


export class PostService {

    static async createPost(postInfo: Partial<IPostSchema>, id: string): Promise<IPostSchema> {
        const post = new PostModel({
            ...postInfo,
            author: id,
            isPublic: false,
            id: undefined
        });
        await post.save();
        return await post.populate('author').execPopulate();
    }

    static async getPublicPostById(id: string): Promise<IPostSchema> {
        if (id === undefined) throw new ErrorHandler(NOT_FOUND, 'User not found');
        const user = await PostModel.findById(id).populate('author');
        if(user) return user;
        throw new ErrorHandler(NOT_FOUND, 'User not found');
    }

    static async getPublicPostsByUserId(id: string, page: number = 1, limit: number = 10) {
        return await PostModel.paginate({
            author: id,
            isPublic: true
        }, {
            populate: 'author',
            page,
            limit
        });
    }

    static async getPrivatePostsByUserId(currentUser: IUser, id: string, page: number = 1, limit: number = 10) {
        if (!currentUser || id !== currentUser.id || currentUser.role === UserRole.SUPER) throw new ErrorHandler(FORBIDDEN, 'Action not allowed');
        return await PostModel.paginate({
            author: id,
            isPublic: false
        }, {
            populate: 'author',
            page,
            limit
        });
    }

    static async getPostBySlug(slug: string): Promise<IPostSchema> {
        const post = await PostModel.findOne({
            slug,
            isPublic: true
        }).populate('author').exec();
        if (!post) throw new ErrorHandler(NOT_FOUND, 'Post not found');
        return post;
    }

}