import { PostController } from '@Controllers/post.controller';
import { UserController } from '@Controllers/user.controller';
import { UserRole } from '@Interfaces/user.interface';
import { AuthJWTGuard } from '@Middlewares/auth.middleware';
import { AuthRoleGuard } from '@Middlewares/role.middleware';
import { ValidationGuard } from '@Middlewares/validator.middleware';
import { ExtRouter } from '@Utils/Router/ExtRouter';
import { UpdateUserSchemaValidator } from '@Validators/user.validator';

const ROUTE_PATH = '/users';

const router = new ExtRouter();

//router.use(ROUTE_PATH, MemCacheMiddleware(config.MEMCACHE_TIMEOUT, 'users'));
// router.use(RedisMiddleware);

router
	.get(ROUTE_PATH, UserController.getAll)
	.get(ROUTE_PATH + '/:id', UserController.getById)
	.get(ROUTE_PATH + '/:id/posts', PostController.getPublicPostsByUserId)
	.get(
		ROUTE_PATH + '/:id/posts/private',
		[AuthJWTGuard, AuthRoleGuard([UserRole.ADMIN, UserRole.SUPER])],
		PostController.getPrivatePostsByUserId
	)
	.put(
		ROUTE_PATH + '/:id',
		[AuthJWTGuard, ValidationGuard(UpdateUserSchemaValidator)],
		UserController.update
	);

export default router.router;
