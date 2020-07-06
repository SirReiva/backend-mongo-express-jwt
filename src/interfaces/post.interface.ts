import { IUserSchema } from '@Schemas/user.schema';

export interface IPost {
    id?: any;
    title: string;
    content: string;
    author: IUserSchema;
    isPublic: boolean;
    slug: string;
    createdAt: string;
    updatedAt: string;
}

export type IPostCreateUpdate = Omit<
    IPost,
    'id' | 'slug' | 'createdAt' | 'updatedAt'
>;
