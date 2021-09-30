import { RateLimiterMemory, IRateLimiterOptions } from 'rate-limiter-flexible';
import { Response, Request, NextFunction } from 'express';
import config from '@Config/index';
import HTTP_CODES from 'http-status-codes';

const opts: IRateLimiterOptions = {
	points: config.RATE.POINTS,
	duration: config.RATE.DURATION,
	blockDuration: config.RATE.BLOCKDURATION,
}; //confug?? pm2 config

const rateLimiter = new RateLimiterMemory(opts);

/**
 * @param  {Request} req http request
 * @param  {Response} res http response
 * @param  {NextFunction} next Function to continue
 */
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
			res.status(HTTP_CODES.TOO_MANY_REQUESTS).send('Too Many Requests');
		});
};
