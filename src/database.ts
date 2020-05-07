import mongoose, { ConnectionOptions } from 'mongoose';
import config from './config';

export const connect = () => {
    const dbOptions: ConnectionOptions = {
        user: config.DB.USER,
        pass: config.DB.PASSWORD,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        poolSize: 5,
    };

    const $p = mongoose.connect(config.DB.URL, dbOptions);
    const connection = mongoose.connection;
    connection.once('open', () => console.log('DB connected'));

    connection.on('error', (err) => console.error('Db error', err));

    connection.on('disconnected', () => {
        console.log('disconected');
    });

    return $p;
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
