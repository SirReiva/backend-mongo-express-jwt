import { Router } from 'express';
import {
    createPost,
    getAllPublic,
    getById,
    getPostBySlug,
    updatePost,
    deletePost,
} from '@Controllers/post.controller';
import { handlerExceptionRoute } from '@Error';
import { AuthJWTGuard } from '@Middlewares/auth.middleware';
import { AuthRole } from '@Middlewares/role.middleware';
import { UserRole } from '@Interfaces/user.model';

const ROUTE_PATH = '/posts';

const router = Router();

//router.use(ROUTE_PATH, MemCacheMiddleware(240, 'posts'));
// router.use(RedisMiddleware);

router
    .get(ROUTE_PATH, handlerExceptionRoute(getAllPublic))
    .get(ROUTE_PATH + '/slug/:slug', handlerExceptionRoute(getPostBySlug))
    .get(ROUTE_PATH + '/:id', handlerExceptionRoute(getById))
    .post(
        ROUTE_PATH,
        [AuthJWTGuard, AuthRole([UserRole.ADMIN, UserRole.SUPER])],
        handlerExceptionRoute(createPost)
    )
    .put(
        ROUTE_PATH + '/:id',
        [AuthJWTGuard, AuthRole([UserRole.ADMIN, UserRole.SUPER])],
        handlerExceptionRoute(updatePost)
    )
    .delete(
        ROUTE_PATH + '/:id',
        [AuthJWTGuard, AuthRole([UserRole.ADMIN, UserRole.SUPER])],
        handlerExceptionRoute(deletePost)
    );

export default router;
