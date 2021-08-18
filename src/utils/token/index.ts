import jwt, { SignOptions } from 'jsonwebtoken';
import config from '@Config/index';
import { IUserSchema } from '@Schemas/user.schema';
import { Cache } from 'memory-cache';

const memCacheRefeshToken = new Cache<string, string>();

/**
 * @param  {string} token Token to check
 * @returns Promise
 */
export const checkToken = (
    token: string
): Promise<Partial<IUserSchema> | null> => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, config.JWTSECRET, (err, decoded) => {
            if (err) return resolve(null);
            return resolve(decoded as any);
        });
    });
};

/**
 * @param  {IUserSchema} user User Schema to generate auth token
 * @returns string
 */
export const createToken = function (user: IUserSchema): string {
    const jwtOps: SignOptions = {
        expiresIn: config.JWT_EXPIRATION,
    };
    return jwt.sign({ ...user.toJSON() }, config.JWTSECRET, jwtOps);
};

/**
 * @param  {IUserSchema} user User Schema to generate refresh token
 * @returns string
 */
export const createRefeshToken = function (user: IUserSchema): string {
    const jwtOps: SignOptions = {
        expiresIn: config.JWT_EXPIRATION_REFRESH,
    };
    return jwt.sign({ ...user.toJSON() }, config.JWTSECRET, jwtOps);
};

/**
 * @param  {string} userId user token owner
 * @param  {string} token
 * @returns string current token
 */

export const storeRefreshToken = (userId: string, token: string): string => {
    memCacheRefeshToken.put(token, userId);
    return token;
};
/**
 * @param  {string} userId user token owner
 * @param  {string} token
 * @returns Boolean is user owner
 */
export const validateRefreshToken = (
    userId: string,
    token: string
): boolean => {
    const expectUserId = memCacheRefeshToken.get(token);
    if (expectUserId !== null && expectUserId === userId) {
        memCacheRefeshToken.del(token);
        return true;
    }
    return false;
};
