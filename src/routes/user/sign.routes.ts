import { Router } from 'express';
import { signIn, signUp, reSignIn } from '../../controllers/user.controller';
import { handlerExceptionRoute } from '../../error/index';

const ROUTE_PATH = '/sign';

const router = Router();

router
    .post(ROUTE_PATH + 'up', handlerExceptionRoute(signUp))
    .post(ROUTE_PATH + 'in', handlerExceptionRoute(signIn))
    .post(ROUTE_PATH + 'refresh', handlerExceptionRoute(reSignIn));

export default router;
