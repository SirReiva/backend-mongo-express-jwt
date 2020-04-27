import PostModel, { IPostSchema } from '../schemas/post.schema';
import { ErrorHandler } from '../error/index';
import { NOT_FOUND, FORBIDDEN } from 'http-status-codes';
import { UserRole, IUser } from '../interfaces/user.model';
import { IPost } from '../interfaces/post.model';
import { IUserSchema } from '../schemas/user.schema';


export class PostService {

    static async createPost(postInfo: Partial<IPostSchema>, id: string): Promise<IPostSchema> {
        delete postInfo.id;
        const post = new PostModel({
            ...postInfo,
            author: id,
            isPublic: false
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

    static async update(id: string, info: Partial<IPost>, user: IUserSchema) {
        if (user.role === UserRole.SUPER) {
            const post = await PostModel.findByIdAndUpdate(id, {
                ...info
            } , {
                new: true
            }).exec();
            if (!post) throw new ErrorHandler(NOT_FOUND, 'Post not found');
            return post;
        } else {
            let post = await PostModel.findById(id).exec();
            if (!post) throw new ErrorHandler(NOT_FOUND, 'Post not found');
            if (post.author.toString() !== user.id)  throw new ErrorHandler(FORBIDDEN, 'Unauthorized action');
            post = await PostModel.findByIdAndUpdate(id, {
                ...info
            } , {
                new: true
            }).exec();
            if (!post) throw new ErrorHandler(NOT_FOUND, 'Post not found');
            return post;
        }
    }

    static async delete(id: string, user: IUserSchema) {
        if (user.role === UserRole.USER) return await PostModel.findByIdAndDelete(id).exec();
        else {
            let post = await PostModel.findById(id).exec();
            if (!post) throw new ErrorHandler(NOT_FOUND, 'Post not found');
            if (post.author.toString() !== user.id)  throw new ErrorHandler(FORBIDDEN, 'Unauthorized action');
            return await PostModel.findByIdAndDelete(id).exec();
        }
    }

}