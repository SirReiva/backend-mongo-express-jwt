import { PostController } from '@Controllers/post.controller';
import { UserRole } from '@Interfaces/user.interface';
import { AuthJWTGuard } from '@Middlewares/auth.middleware';
import { MemCacheMiddleware } from '@Middlewares/cache/mem-cache.middelware';
import { AuthRoleGuard } from '@Middlewares/role.middleware';
import { ValidationGuard } from '@Middlewares/validator.middleware';
import { ExtRouter } from '@Utils/Router/ExtRouter';
import {
	CreatePostSchemaValidator,
	UpdatePostSchemaValidator,
} from '@Validators/post.validator';

const ROUTE_PATH = '/posts';

const router = new ExtRouter();

router.use(ROUTE_PATH, MemCacheMiddleware(240, 'posts'));
// router.use(RedisMiddleware);

router
	.get(ROUTE_PATH, PostController.getAllPublic)
	.get(ROUTE_PATH + '/slug/:slug', PostController.getPostBySlug)
	.get(ROUTE_PATH + '/:id', PostController.getById)
	.post(
		ROUTE_PATH,
		[
			AuthJWTGuard,
			AuthRoleGuard([UserRole.ADMIN, UserRole.SUPER]),
			ValidationGuard(CreatePostSchemaValidator),
		],
		PostController.createPost
	)
	.put(
		ROUTE_PATH + '/:id',
		[
			AuthJWTGuard,
			AuthRoleGuard([UserRole.ADMIN, UserRole.SUPER]),
			ValidationGuard(UpdatePostSchemaValidator),
		],
		PostController.updatePost
	)
	.delete(
		ROUTE_PATH + '/:id',
		[AuthJWTGuard, AuthRoleGuard([UserRole.ADMIN, UserRole.SUPER])],
		PostController.deletePost
	);

export default router.router;
