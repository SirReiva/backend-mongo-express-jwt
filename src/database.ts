import mongoose, { ConnectOptions } from 'mongoose';
import config from '@Config/index';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClientOptions } from 'mongodb';
const isTest = process.env.NODE_ENV === 'test';

export const connect = async (): Promise<typeof mongoose> => {


	if (isTest) {
		const dbOptions: ConnectOptions = {};
		const mongod = await MongoMemoryServer.create();
		const uri = await mongod.getUri('cms');
		return await mongoose.connect(uri, dbOptions);
	} else {
		const dbOptions: ConnectOptions = {
			auth: {
				username: config.DB.USER,
				password: config.DB.PASSWORD,
			}
		};
		const con = await mongoose.connect(config.DB.URL, dbOptions);
		const connection = mongoose.connection;
		connection.once('open', () => console.log('DB connected'));

		connection.on('error', err => console.error('Db error', err));

		connection.on('disconnected', () => {
			console.log('disconected');
		});

		return con;
	}
};

/**
 * @param  {Function} cb Function to execute with transaction
 */
export const transactionWrapper = async <T>(
	cb: () => Promise<T>
): Promise<T> => {
	const transaction = await mongoose.connection.startSession();
	try {
		const res = await cb();
		transaction.endSession();
		return res;
	} catch (error) {
		await transaction.abortTransaction();
		throw error;
	}
};

// export const UserRepository = new Proxy({}, {
//     set: function(target:any, key: string | number | symbol, value: any) { return false; },
//     get: function(target:any, key: string | number | symbol, reciever: any): any {
//         return undefined;
//     },
//     apply: function(target: Function, context:any, args:any):any {
//         target.name
//     }
// });
