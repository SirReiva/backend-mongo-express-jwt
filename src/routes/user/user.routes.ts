import { Router } from 'express';
import { PostController } from '@Controllers/post.controller';
import { UserController } from '@Controllers/user.controller';
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
    .get(ROUTE_PATH, handlerExceptionRoute(UserController.getAll))
    .get(ROUTE_PATH + '/:id', handlerExceptionRoute(UserController.getById))
    .get(
        ROUTE_PATH + '/:id/posts',
        handlerExceptionRoute(PostController.getPublicPostsByUserId)
    )
    .get(
        ROUTE_PATH + '/:id/posts/private',
        [AuthJWTGuard, AuthRoleGuard([UserRole.ADMIN, UserRole.SUPER])],
        handlerExceptionRoute(PostController.getPrivatePostsByUserId)
    )
    .put(
        ROUTE_PATH + '/:id',
        [AuthJWTGuard, ValidationGuard(UpdateUserSchemaValidator)],
        handlerExceptionRoute(UserController.update)
    );

export default router;
