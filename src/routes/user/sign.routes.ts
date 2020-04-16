import { Router } from "express";
import { signIn, signUp } from '../../controllers/user.controller';
import { handlerExceptionRoute } from '../../error/index';
import { MemCacheMiddleware } from '../../middlewares/cache/mem-cache.middelware';

const ROUTE_PATH = '/sign'

const router = Router();

router
    .post(ROUTE_PATH +'up', MemCacheMiddleware(240, 'users'), handlerExceptionRoute(signUp))
    .post(ROUTE_PATH + 'in', handlerExceptionRoute(signIn));

export default router;