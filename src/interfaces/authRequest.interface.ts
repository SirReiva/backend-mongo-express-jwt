import { IUserSchema } from '@Schemas/user.schema';
import { Request } from 'express';

export interface AuthRequest extends Request {
    user: IUserSchema;
}
