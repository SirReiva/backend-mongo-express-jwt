import { Router } from "express";
import { getPrivatePostsByUserId, getPublicPostsByUserId } from '../../controllers/post.controller';
import { getAll, getById } from '../../controllers/user.controller';
import { handlerExceptionRoute } from '../../error/index';
import { AuthJWTGuard } from '../../middlewares/auth.middleware';

const ROUTE_PATH = '/users';

const router = Router();

//router.use(ROUTE_PATH, MemCacheMiddleware(config.MEMCACHE_TIMEOUT, 'users'));
// router.use(RedisMiddleware);

router
    .get(ROUTE_PATH, handlerExceptionRoute(getAll))
    .get(ROUTE_PATH + '/:id', handlerExceptionRoute(getById))
    .get(ROUTE_PATH + '/:id/posts', handlerExceptionRoute(getPublicPostsByUserId))
    .get(ROUTE_PATH + '/:id/posts/private', AuthJWTGuard, handlerExceptionRoute(getPrivatePostsByUserId));

export default router;