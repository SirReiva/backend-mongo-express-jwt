import { Router } from 'express';
import {
    createPost,
    getAllPublic,
    getById,
    getPostBySlug,
    updatePost,
    deletePost,
} from '@Controllers/post.controller';
import { handlerExceptionRoute } from '@Error/index';
import { AuthJWTGuard } from '@Middlewares/auth.middleware';
import { AuthRoleGuard } from '@Middlewares/role.middleware';
import { UserRole } from '@Interfaces/user.interface';
import { ValidationGuard } from '@Middlewares/validator.middleware';
import {
    CreatePostSchemaValidator,
    UpdatePostSchemaValidator,
} from '@Validators/post.validator';

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
        [
            ValidationGuard(CreatePostSchemaValidator),
            AuthJWTGuard,
            AuthRoleGuard([UserRole.ADMIN, UserRole.SUPER]),
        ],
        handlerExceptionRoute(createPost)
    )
    .put(
        ROUTE_PATH + '/:id',
        [
            ValidationGuard(UpdatePostSchemaValidator),
            AuthJWTGuard,
            AuthRoleGuard([UserRole.ADMIN, UserRole.SUPER]),
        ],
        handlerExceptionRoute(updatePost)
    )
    .delete(
        ROUTE_PATH + '/:id',
        [AuthJWTGuard, AuthRoleGuard([UserRole.ADMIN, UserRole.SUPER])],
        handlerExceptionRoute(deletePost)
    );

export default router;
