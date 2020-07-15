import redis from 'redis';
import { Request, Response } from 'express';

const client = redis.createClient();

export const RedisMiddleware = (
    req: Request,
    res: Response,
    next: Function
) => {
    if (req.method !== 'GET') return next();
    let key = '__expIress__' + req.originalUrl || req.url;
    client.get(key, function (_err, reply) {
        if (reply) {
            console.log('From cache response');
            res.send(reply);
        } else {
            const tmpSnd = res.send.bind(res);
            res.send = function (body: any): Response<any> {
                client.set(key, JSON.stringify(body));
                client.expire(key, 10);
                return tmpSnd(body);
            };
            next();
        }
    });
};
