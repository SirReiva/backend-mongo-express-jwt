import { Router } from "express";
import { getAll, getById } from '../../controllers/user.controller';
import { handlerExceptionRoute } from '../../error/index';
import { MemCacheMiddleware } from '../../middlewares/cache/mem-cache.middelware';
import { AuthJWTGuard } from '../../middlewares/auth.middleware';

const ROUTE_PATH = '/users';

const router = Router();

router.use(ROUTE_PATH, AuthJWTGuard);

router.use(ROUTE_PATH, MemCacheMiddleware(240, 'users'));
// router.use(RedisMiddleware);

router
    .get(ROUTE_PATH, handlerExceptionRoute(getAll))
    .get(ROUTE_PATH + '/:id', handlerExceptionRoute(getById));

export default router;