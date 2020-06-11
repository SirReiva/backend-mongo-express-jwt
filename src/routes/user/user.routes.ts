import { Router } from 'express';
import {
    getPrivatePostsByUserId,
    getPublicPostsByUserId,
} from '@Controllers/post.controller';
import { getAll, getById, update } from '@Controllers/user.controller';
import { handlerExceptionRoute } from '@Error/index';
import { AuthJWTGuard } from '@Middlewares/auth.middleware';
import { AuthRoleGuard } from '@Middlewares/role.middleware';
import { UserRole } from '@Interfaces/user.interface';
import { ValidationGuard } from '@Middlewares/validator.middleware';
import { UpdateUserSchemaValidator } from '@Validators/user.validator';

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
        [AuthJWTGuard, AuthRoleGuard([UserRole.ADMIN, UserRole.SUPER])],
        handlerExceptionRoute(getPrivatePostsByUserId)
    )
    .put(
        ROUTE_PATH + '/:id',
        [ValidationGuard(UpdateUserSchemaValidator), AuthJWTGuard],
        handlerExceptionRoute(update)
    );

export default router;
