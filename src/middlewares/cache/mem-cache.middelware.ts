import { Request, Response } from 'express';
import { Cache, CacheClass } from 'memory-cache';

const memCache = new Cache();
const memCacheStores = new Map<string, CacheClass<string, any>>();

/**
 * @param  {string} store?
 * @returns CacheClass
 */
const getMemCacheFromStore = (
    store?: string
): CacheClass<any, any> | undefined =>
    store ? memCacheStores.get(store) : memCache;

/**
 * @param  {number} duration
 * @param  {string} store?
 */
export const MemCacheMiddleware = (duration: number, store?: string) => {
    if (store && !memCacheStores.has(store))
        memCacheStores.set(store, new Cache());
    return (req: Request, res: Response, next: Function) => {
        if (req.method !== 'GET') {
            console.log('clear ', store);
            clearCache(store);
            return next();
        }
        const key = '__express__' + req.originalUrl || req.url;
        const cacheContent = getMemCacheFromStore(store)?.get(key);
        if (cacheContent) {
            console.log('From cache response - store:', store);
            res.send(cacheContent);
            return;
        } else {
            const tmpSnd = res.send.bind(res);
            res.send = function (body: any): Response<any> {
                if (res.statusCode < 400)
                    getMemCacheFromStore(store)?.put(
                        key,
                        body,
                        duration * 1000
                    ); //test?¿
                return tmpSnd(body);
            };
            next();
        }
    };
};

/**
 * @param  {string} store?
 */
export const clearCache = (store?: string) => {
    try {
        getMemCacheFromStore(store)?.clear();
    } catch (error) {
        console.error('Memcache Error:', error);
    }
};
