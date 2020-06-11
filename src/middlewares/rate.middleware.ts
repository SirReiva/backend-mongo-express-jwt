import { RateLimiterMemory, IRateLimiterOptions } from 'rate-limiter-flexible';
import { Response, Request, NextFunction } from 'express';
import config from '@Config/index';

const opts: IRateLimiterOptions = {
    points: config.RATE.POINTS,
    duration: config.RATE.DURATION,
    blockDuration: config.RATE.BLOCKDURATION,
}; //confug?? pm2 config

const rateLimiter = new RateLimiterMemory(opts);

export const rateLimiterMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    rateLimiter
        .consume(req.ip)
        .then(() => {
            next();
        })
        .catch(() => {
            res.status(429).send('Too Many Requests');
        });
};
