import { Router } from 'express';
import config from '@Config/index';
import SingRoutes from '@Routes/user/sign.routes';
import UserRoutes from '@Routes/user/user.routes';
import PostRoutes from '@Routes/post/post.routes';

const apiPrefix = '/api/' + config.VERSION;

const Routes = Router();

Routes.use(apiPrefix, [SingRoutes, UserRoutes, PostRoutes]);

export default Routes;
