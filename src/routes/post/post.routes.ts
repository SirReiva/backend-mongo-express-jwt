import { Router } from 'express';
import { PostController } from '@Controllers/post.controller';
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
    .get(ROUTE_PATH, handlerExceptionRoute(PostController.getAllPublic))
    .get(
        ROUTE_PATH + '/slug/:slug',
        handlerExceptionRoute(PostController.getPostBySlug)
    )
    .get(ROUTE_PATH + '/:id', handlerExceptionRoute(PostController.getById))
    .post(
        ROUTE_PATH,
        [
            AuthJWTGuard,
            AuthRoleGuard([UserRole.ADMIN, UserRole.SUPER]),
            ValidationGuard(CreatePostSchemaValidator),
        ],
        handlerExceptionRoute(PostController.createPost)
    )
    .put(
        ROUTE_PATH + '/:id',
        [
            AuthJWTGuard,
            AuthRoleGuard([UserRole.ADMIN, UserRole.SUPER]),
            ValidationGuard(UpdatePostSchemaValidator),
        ],
        handlerExceptionRoute(PostController.updatePost)
    )
    .delete(
        ROUTE_PATH + '/:id',
        [AuthJWTGuard, AuthRoleGuard([UserRole.ADMIN, UserRole.SUPER])],
        handlerExceptionRoute(PostController.deletePost)
    );

export default router;
