import mongoose, { ConnectionOptions } from 'mongoose';
import config from '@Config/index';
import { MongoMemoryServer } from 'mongodb-memory-server';
const isTest = process.env.NODE_ENV === 'test';

export const connect = async (): Promise<typeof mongoose> => {
    const dbOptions: ConnectionOptions = {
        user: config.DB.USER,
        pass: config.DB.PASSWORD,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        poolSize: 5,
    };

    if (isTest) {
        const mongod = new MongoMemoryServer();
        const uri = await mongod.getConnectionString('cms');
        return await mongoose.connect(uri, {
            useNewUrlParser: true,
            useCreateIndex: true,
        });
    } else {
        const con = await mongoose.connect(config.DB.URL, dbOptions);
        const connection = mongoose.connection;
        connection.once('open', () => console.log('DB connected'));

        connection.on('error', (err) => console.error('Db error', err));

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
