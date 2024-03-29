import { Response, NextFunction, Request } from 'express';
import HTTP_CODES from 'http-status-codes';
import { Error as MongooseError } from 'mongoose';
import { MongoError } from 'mongodb';

export class ErrorHandler extends Error {
	statusCode: number;
	/**
	 * @param  {number} statusCode HTTP Error code
	 * @param  {string} message Error message
	 */
	constructor(statusCode: number, message: string, trace?: string) {
		super();
		this.statusCode = statusCode;
		this.message = message;
		this.stack = trace;
	}
}

/**
 * @param  {any} err Error ocurred before
 * @param  {Response} res http response
 */
const handleError = (err: ErrorHandler, res: Response) => {
	const { statusCode = HTTP_CODES.INTERNAL_SERVER_ERROR, message } = err;
	res.status(statusCode).json({
		status: 'error',
		statusCode,
		message,
	});
};

/**
 * @param  {any} err Error ocurred inside route or middelware
 * @param  {Request} req http request
 * @param  {Response} res http response
 * @param  {NextFunction} next function to continue next route/middleware
 */
export const handleErrorMiddleware = (
	err: any,
	_req: Request,
	res: Response,
	_next: NextFunction
) => {
	handleError(err, res);
};

/**
 * @param  {Error} error Error ocurred inside route or middelware
 * @param  {NextFunction} next function to continue next route/middleware
 */
export const errorParse = (error: Error, next: NextFunction) => {
	if (
		error instanceof MongooseError.ValidationError ||
		error instanceof MongooseError.CastError ||
		error instanceof MongoError
	)
		next(new ErrorHandler(HTTP_CODES.BAD_REQUEST, error.message, error.stack));
	else if (error instanceof ErrorHandler) next(error);
	else
		next(
			new ErrorHandler(
				HTTP_CODES.INTERNAL_SERVER_ERROR,
				'Error performing action',
				error.stack
			)
		);
};

/**
 * @param  {Function} Wrapper function to handle any error inside
 */
export const handlerExceptionRoute =
	async (fn: Function) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			fn(req, res);
		} catch (error) {
			console.log('Not Promise Error', (error as Error).name);
			errorParse(error as Error, next);
		}
	};
