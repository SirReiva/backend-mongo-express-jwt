import HTTP_CODES from 'http-status-codes';
import UserModel from '@Schemas/user.schema';
import { ErrorHandler } from '@Error/index';
import { UserRole, IUser, IUserUpdate } from '@Interfaces/user.interface';
import { IUserSchema } from '@Schemas/user.schema';
import {
	createToken,
	createRefeshToken,
	checkToken,
	storeRefreshToken,
	validateRefreshToken,
} from '@Utils/token';
import bcrypt from 'bcrypt';

export class UserService {
	/**
	 * @param  {string} name User name
	 * @param  {string} email User email
	 * @param  {string} password User password
	 * @param  {UserRole} [role==UserRole.USER] User role
	 * @param  {IUserSchema=} currentUSer Currrent user action
	 * @returns Promise
	 */
	static async createUser(
		name: string,
		email: string,
		password: string,
		role: UserRole = UserRole.USER,
		currentUSer?: IUserSchema
	): Promise<IUserSchema> {
		if (!name || !email || !password)
			throw new ErrorHandler(HTTP_CODES.BAD_REQUEST, 'bad request');
		const results = await UserModel.find({
			$or: [{ email }, { name }],
		});
		if (results.length > 0)
			throw new ErrorHandler(
				HTTP_CODES.BAD_REQUEST,
				'Name or Email already in use'
			);
		const salt = await bcrypt.genSalt(10);
		const newUser = new UserModel({
			email,
			name,
			password: await bcrypt.hash(password, salt),
			active: true,
			role:
				currentUSer && currentUSer.role === UserRole.SUPER
					? role
					: UserRole.USER,
		});
		await newUser.save();
		return newUser;
	}

	/**
	 * @param  {string} name User name
	 * @param  {string} password User password
	 * @returns Promise
	 */
	static async signIn(
		name: string,
		password: string
	): Promise<{ token: string; refreshToken: string }> {
		const user = await UserModel.findOne({
			name,
			active: true,
		});
		if (!user)
			throw new ErrorHandler(HTTP_CODES.BAD_REQUEST, 'Wrong credentials');

		if (await bcrypt.compare(password, user.password)) {
			return {
				token: createToken(user),
				refreshToken: storeRefreshToken(user.id, createRefeshToken(user)),
			};
		}
		throw new ErrorHandler(HTTP_CODES.BAD_REQUEST, 'Wrong credentials');
	}

	/**
	 * @param  {string} refreshToken Resfresh token
	 * @returns Promise
	 */
	static async refreshToken(
		refreshToken: string
	): Promise<{ token: string; refreshToken: string }> {
		const payload = await checkToken(refreshToken);
		if (!payload || !validateRefreshToken(payload.id, refreshToken))
			throw new ErrorHandler(HTTP_CODES.BAD_REQUEST, 'Wrong refesh token');
		const user = await UserModel.findOne({
			$and: [
				{ email: payload.email },
				{ name: payload.name },
				{ _id: payload.id },
			],
		}).exec();
		if (!user)
			throw new ErrorHandler(HTTP_CODES.BAD_REQUEST, 'Wrong refesh token');
		return {
			token: createToken(user),
			refreshToken: storeRefreshToken(user.id, createRefeshToken(user)),
		};
	}

	/**
	 * @param  {number} [page=1] Current page
	 * @param  {number} [limit=10] Page size
	 */
	static async findAll(page: number = 1, limit: number = 10) {
		return await UserModel.paginate(
			{
				active: true,
			},
			{
				page,
				limit,
			}
		);
	}

	/**
	 * @param  {string} id User ID
	 * @returns Promise
	 */
	static async getById(id: string): Promise<IUser> {
		if (id === undefined)
			throw new ErrorHandler(HTTP_CODES.NOT_FOUND, 'User not found');
		const user = await UserModel.findById(id).exec();
		if (user) return user;
		throw new ErrorHandler(HTTP_CODES.NOT_FOUND, 'User not found');
	}

	/**
	 * @param  {string} id User ID
	 * @param  {IUserUpdate} partialUser Partial User Schema
	 * @param  {IUserSchema} currentUser? Currrent user action
	 */
	static async update(
		id: string,
		partialUser: IUserUpdate,
		currentUser?: IUserSchema
	) {
		if (id === undefined)
			throw new ErrorHandler(HTTP_CODES.NOT_FOUND, 'User not found');
		if (
			currentUser &&
			(currentUser.id === id || currentUser.role === UserRole.SUPER)
		) {
			if (currentUser.role !== UserRole.SUPER) delete (partialUser as any).role;
			return await UserModel.findOneAndUpdate(
				{
					id,
				},
				{
					...partialUser,
				}
			).exec();
		}
		return new ErrorHandler(HTTP_CODES.FORBIDDEN, 'No permission');
	}
}
