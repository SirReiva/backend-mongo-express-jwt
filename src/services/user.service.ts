import { BAD_REQUEST, NOT_FOUND } from 'http-status-codes';
import UserModel from '../schemas/user.schema';
import { ErrorHandler } from '../error';
import { UserRole } from '../interfaces/user.model';
import { IUserSchema } from '../schemas/user.schema';
import { createToken, createRefeshToken, checkToken } from '../middlewares/auth.middleware';

export class UserService {
    static async createUser(name: string, email: string, password: string): Promise<IUserSchema> {
        if (!name || !email || !password)
            throw new ErrorHandler(BAD_REQUEST, 'bad request');
        const results = await UserModel.find({
            $or: [
                { email },
                { name }
            ]
        });
        if (results.length > 0)
            throw new ErrorHandler(BAD_REQUEST, 'Name or Email already in use');
        const newUser = new UserModel({
            email,
            name,
            password,
            active: true,
            role: UserRole.USER
        });
        await newUser.save();
        return newUser;
    }

    static async signIn(name: string, password: string): Promise<{token:string, refreshToken: string}> {
        if (!name || !password)
            throw new ErrorHandler(BAD_REQUEST, 'bad request');
        const user = await UserModel.findOne({
            name,
            active: true,
        });
        if (!user) throw new ErrorHandler(BAD_REQUEST, 'Wrong credentials');
        
        if (await user.comparePassword(password)) {
            return { token: createToken(user), refreshToken: createRefeshToken(user) };
        }
        throw new ErrorHandler(BAD_REQUEST, 'Wrong credentials');
    }

    static async refreshToken(refreshToken: string): Promise<{token:string, refreshToken: string}> {
        if (!refreshToken) throw new ErrorHandler(BAD_REQUEST, 'No token provided');
        const payload: any = await checkToken(refreshToken);
        if(!payload) throw new ErrorHandler(BAD_REQUEST, 'Wrong refesh token');
        const user = await UserModel.findOne({
            $and: [
                { email: payload.email },
                { name: payload.name },
                { _id: payload.id }
            ]
        });
        if (!user) throw new ErrorHandler(BAD_REQUEST, 'Wrong refesh token');
        return { token: createToken(user), refreshToken: createRefeshToken(user) };
    }
    
    static async findAll(page: number = 1, limit: number = 10) {
        return await UserModel.paginate({
            active: true
        }, {
            page,
            limit
        })
    }

    static async getById(id: string): Promise<IUserSchema> {
        if (id === undefined) throw new ErrorHandler(NOT_FOUND, 'User not found');
        const user = await UserModel.findById(id);
        if(user) return user;
        throw new ErrorHandler(NOT_FOUND, 'User not found');
    }
}