import { Router } from "express";
import { handlerExceptionRoute } from '../../error/index';
import { MemCacheMiddleware } from '../../middlewares/cache/mem-cache.middelware';
import { AuthJWTGuard } from '../../middlewares/auth.middleware';
import { createPost, getAllPublic, getById, getPostBySlug } from '../../controllers/post.controller';

const ROUTE_PATH = '/posts';

const router = Router();

router.use(ROUTE_PATH, MemCacheMiddleware(240, 'posts'));
// router.use(RedisMiddleware);

router.get(ROUTE_PATH, handlerExceptionRoute(getAllPublic))
    .get(ROUTE_PATH + '/slug/:slug', handlerExceptionRoute(getPostBySlug))
    .get(ROUTE_PATH + '/:id', handlerExceptionRoute(getById))
    .post(ROUTE_PATH, AuthJWTGuard, handlerExceptionRoute(createPost));

export default router;