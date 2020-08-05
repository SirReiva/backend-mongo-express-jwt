import { IUserSchema } from '../schemas/user.schema';

declare global {
    namespace Express {
        interface Request {
            user?: IUserSchema;
        }
    }
}
