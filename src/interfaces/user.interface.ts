export enum UserRole {
	USER = 'USER',
	ADMIN = 'ADMIN',
	SUPER = 'SUPER',
}

export interface IUser {
	id?: any;
	email: string;
	password: string;
	name: string;
	role: UserRole;
	createdAt: string;
	updatedAt: string;
	active: true;
}

export type IUserUpdate = Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>;
