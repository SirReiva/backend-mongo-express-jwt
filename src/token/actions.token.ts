import jwt, { SignOptions } from 'jsonwebtoken';
import config from '@Config/index';
import { IUserSchema } from '@Schemas/user.schema';

/**
 * @param  {string} token Token to check
 */
export const checkToken = (token: string) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, config.JWTSECRET, (err, decoded) => {
            if (err) return resolve(null);
            return resolve(decoded);
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
