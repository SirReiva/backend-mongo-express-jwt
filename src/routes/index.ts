import { Router } from 'express';
import config from '../config';
import SingRoutes from './user/sign.routes';
import UserRoutes from './user/user.routes';
import PostRoutes from './post/post.routes';

const apiPrefix = '/api/' + config.VERSION;

const Routes = Router();

Routes.use(apiPrefix, [SingRoutes, UserRoutes, PostRoutes]);

export default Routes;
