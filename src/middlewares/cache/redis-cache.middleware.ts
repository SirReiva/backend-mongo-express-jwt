import { Request, Response } from 'express';
import Redis from 'ioredis';

const client = new Redis({
	db: 0,
});
let currentDBIndex = 0;
const dbMap: Record<string, number> = {};

export const RedisMiddleware =
	(time: string, store: string) =>
	async (req: Request, res: Response, next: Function) => {
		if (dbMap[store] === undefined) {
			dbMap[store] = currentDBIndex++;
		}
		await client.select(dbMap[store]);
		if (req.method !== 'GET') {
			client.flushall();
			return next();
		}
		const key = req.originalUrl || req.url;
		const resp = await client.get(key);
		if (resp) {
			console.log('From cache response');
			res.send(JSON.parse(resp));
		} else {
			const tmpSnd = res.send.bind(res);
			res.send = function (body: any): Response<any> {
				if (res.statusCode < 400) {
					client.select(dbMap[store], err => {
						if (!err) client.set(key, JSON.stringify(body), 'EX', time);
					});
				}
				return tmpSnd(body);
			};
			next();
		}
	};
