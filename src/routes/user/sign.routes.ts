import { Router } from 'express';
import { UserController } from '@Controllers/user.controller';
import { handlerExceptionRoute } from '@Error/index';
import { ValidationGuard } from '@Middlewares/validator.middleware';
import {
    CreateUserSchemaValidator,
    SignInUserSchemaValidator,
    ReSignInUserSchemaValidator,
} from '@Validators/user.validator';

const ROUTE_PATH = '/sign';

const router = Router();

router
    .post(
        ROUTE_PATH + 'up',
        ValidationGuard(CreateUserSchemaValidator),
        handlerExceptionRoute(UserController.signUp)
    )
    .post(
        ROUTE_PATH + 'in',
        ValidationGuard(SignInUserSchemaValidator),
        handlerExceptionRoute(UserController.signIn)
    )
    .post(
        ROUTE_PATH + 'refresh',
        ValidationGuard(ReSignInUserSchemaValidator),
        handlerExceptionRoute(UserController.reSignIn)
    );

export default router;
