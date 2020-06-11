import PostModel, { IPostSchema } from '@Schemas/post.schema';
import { ErrorHandler } from '@Error/index';
import { NOT_FOUND, FORBIDDEN } from 'http-status-codes';
import { UserRole } from '@Interfaces/user.model';
import { IPost } from '@Interfaces/post.model';
import { IUserSchema } from '@Schemas/user.schema';

export class PostService {
    /**
     * @param  {Partial<IPostSchema>} postInfo Partial info for Post Schema
     * @param  {string} id Author ID
     * @returns Promise
     */
    static async createPost(
        postInfo: Partial<IPostSchema>,
        id: string
    ): Promise<IPostSchema> {
        const post = new PostModel({
            ...postInfo,
            author: id,
        });
        await post.save();
        return await post.populate('author').execPopulate();
    }

    static async getPublicPosts() {
        return await PostModel.paginate(
            {
                isPublic: true,
            },
            {
                populate: 'author',
            }
        );
    }

    /**
     * @param  {string} id Author ID
     * @returns Promise
     */
    static async getPublicPostById(id: string): Promise<IPostSchema> {
        if (id === undefined)
            throw new ErrorHandler(NOT_FOUND, 'User not found');
        const user = await PostModel.findById(id).populate('author');
        if (user) return user;
        throw new ErrorHandler(NOT_FOUND, 'Post not found');
    }

    /**
     * @param  {string} id Author ID
     * @param  {number} [page=1] Current page
     * @param  {number} [limit=10] Page size
     */
    static async getPublicPostsByUserId(
        id: string,
        page: number = 1,
        limit: number = 10
    ) {
        return await PostModel.paginate(
            {
                author: id,
                isPublic: true,
            },
            {
                populate: 'author',
                page,
                limit,
            }
        );
    }

    /**
     * @param  {IUser} currentUser Current User Schema
     * @param  {string} id Post ID
     * @param  {number} [page=1] Current page
     * @param  {number} [limit=10] Page size
     */
    static async getPrivatePostsByUserId(
        currentUser: IUserSchema,
        id: string,
        page: number = 1,
        limit: number = 10
    ) {
        if (
            !currentUser ||
            (id !== currentUser.id && currentUser.role !== UserRole.SUPER)
        )
            throw new ErrorHandler(FORBIDDEN, 'Action not allowed');
        return await PostModel.paginate(
            {
                author: id,
                isPublic: false,
            },
            {
                populate: 'author',
                page,
                limit,
            }
        );
    }

    /**
     * @param  {string} slug Post Slug
     * @returns Promise
     */
    static async getPostBySlug(slug: string): Promise<IPostSchema> {
        const post = await PostModel.findOne({
            slug,
            isPublic: true,
        })
            .populate('author')
            .exec();
        if (!post) throw new ErrorHandler(NOT_FOUND, 'Post not found');
        return post;
    }

    /**
     * @param  {string} id User ID
     * @param  {Partial<IPost>} info Partial Post Schema
     * @param  {IUserSchema} user User Owner Schema
     * @returns Promise
     */
    static async update(id: string, info: Partial<IPost>, user: IUserSchema) {
        if (user.role === UserRole.SUPER) {
            const post = await PostModel.findByIdAndUpdate(
                id,
                {
                    ...info,
                },
                {
                    new: true,
                }
            ).exec();
            if (!post) throw new ErrorHandler(NOT_FOUND, 'Post not found');
            return post;
        } else {
            let post = await PostModel.findById(id).exec();
            if (!post) throw new ErrorHandler(NOT_FOUND, 'Post not found');
            if (post.author.toString() !== user.id)
                throw new ErrorHandler(FORBIDDEN, 'Unauthorized action');
            post = await PostModel.findByIdAndUpdate(
                id,
                {
                    ...info,
                },
                {
                    new: true,
                }
            ).exec();
            if (!post) throw new ErrorHandler(NOT_FOUND, 'Post not found');
            return post;
        }
    }

    /**
     * @param  {string} id Post ID
     * @param  {IUserSchema} user User Schema
     * @returns Promise
     */
    static async delete(id: string, user: IUserSchema) {
        if (user.role === UserRole.USER)
            return await PostModel.findByIdAndDelete(id).exec();
        else {
            let post = await PostModel.findById(id).exec();
            if (!post) throw new ErrorHandler(NOT_FOUND, 'Post not found');
            if (post.author.toString() !== user.id)
                throw new ErrorHandler(FORBIDDEN, 'Unauthorized action');
            return await PostModel.findByIdAndDelete(id).exec();
        }
    }
}
