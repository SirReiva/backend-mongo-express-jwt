import { IUser } from './user.interface';

export interface IPost {
    id?: any;
    title: string;
    content: string;
    author: Partial<IUser> | string;
    isPublic: boolean;
    slug: string;
    createdAt: string;
    updatedAt: string;
}

export type IPostCreateUpdate = Omit<
    IPost,
    'id' | 'slug' | 'createdAt' | 'updatedAt'
>;
