import { RateLimiterMemory } from 'rate-limiter-flexible';
import { Response, Request, NextFunction } from 'express';

const opts = {
    points: 6, // 6 points
    duration: 1, // Per second
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
