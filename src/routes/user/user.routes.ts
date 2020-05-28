import { Router } from 'express';
import {
    getPrivatePostsByUserId,
    getPublicPostsByUserId,
} from '../../controllers/post.controller';
import { getAll, getById, update } from '../../controllers/user.controller';
import { handlerExceptionRoute } from '../../error/index';
import { AuthJWTGuard } from '../../middlewares/auth.middleware';
import { AuthRole } from '../../middlewares/role.middleware';
import { UserRole } from '../../interfaces/user.model';

const ROUTE_PATH = '/users';

const router = Router();

//router.use(ROUTE_PATH, MemCacheMiddleware(config.MEMCACHE_TIMEOUT, 'users'));
// router.use(RedisMiddleware);

router
    .get(ROUTE_PATH, handlerExceptionRoute(getAll))
    .get(ROUTE_PATH + '/:id', handlerExceptionRoute(getById))
    .get(
        ROUTE_PATH + '/:id/posts',
        handlerExceptionRoute(getPublicPostsByUserId)
    )
    .get(
        ROUTE_PATH + '/:id/posts/private',
        [AuthJWTGuard, AuthRole([UserRole.ADMIN, UserRole.SUPER])],
        handlerExceptionRoute(getPrivatePostsByUserId)
    )
    .put(ROUTE_PATH + '/:id', AuthJWTGuard, handlerExceptionRoute(update));

export default router;
