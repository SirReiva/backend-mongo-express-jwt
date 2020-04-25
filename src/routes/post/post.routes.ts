import { Router } from "express";
import { createPost, getAllPublic, getById, getPostBySlug } from '../../controllers/post.controller';
import { handlerExceptionRoute } from '../../error/index';
import { AuthJWTGuard } from '../../middlewares/auth.middleware';
import { AuthRole } from '../../middlewares/role.middleware';
import { UserRole } from "../../interfaces/user.model";

const ROUTE_PATH = '/posts';

const router = Router();

//router.use(ROUTE_PATH, MemCacheMiddleware(240, 'posts'));
// router.use(RedisMiddleware);

router.get(ROUTE_PATH, handlerExceptionRoute(getAllPublic))
    .get(ROUTE_PATH + '/slug/:slug', handlerExceptionRoute(getPostBySlug))
    .get(ROUTE_PATH + '/:id', handlerExceptionRoute(getById))
    .post(ROUTE_PATH, [AuthJWTGuard, AuthRole([UserRole.ADMIN, UserRole.SUPER])], handlerExceptionRoute(createPost));

export default router;