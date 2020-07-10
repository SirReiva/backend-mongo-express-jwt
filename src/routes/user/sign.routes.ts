import { UserController } from '@Controllers/user.controller';
import { ValidationGuard } from '@Middlewares/validator.middleware';
import { ExtRouter } from '@Utils/Router/ExtRouter';
import {
    CreateUserSchemaValidator,
    ReSignInUserSchemaValidator,
    SignInUserSchemaValidator,
} from '@Validators/user.validator';

const ROUTE_PATH = '/sign';

const router = new ExtRouter();

router
    .post(
        ROUTE_PATH + 'up',
        ValidationGuard(CreateUserSchemaValidator),
        UserController.signUp
    )
    .post(
        ROUTE_PATH + 'in',
        ValidationGuard(SignInUserSchemaValidator),
        UserController.signIn
    )
    .post(
        ROUTE_PATH + 'refresh',
        ValidationGuard(ReSignInUserSchemaValidator),
        UserController.reSignIn
    );

export default router.router;
