import { IUserSchema } from '../schemas/user.schema';
export interface IPost {
    id?: any;
    title: string;
    content: string;
    author: IUserSchema;
    createdAt: string;
    updatedAt: string;
}