import { Router } from 'express';
import { signIn, signUp, reSignIn } from '@Controllers/user.controller';
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
        handlerExceptionRoute(signUp)
    )
    .post(
        ROUTE_PATH + 'in',
        ValidationGuard(SignInUserSchemaValidator),
        handlerExceptionRoute(signIn)
    )
    .post(
        ROUTE_PATH + 'refresh',
        ValidationGuard(ReSignInUserSchemaValidator),
        handlerExceptionRoute(reSignIn)
    );

export default router;
