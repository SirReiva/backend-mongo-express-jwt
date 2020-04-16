import compression from 'compression';
import cors from 'cors';
import express, { Request, Response } from 'express';
import { NO_CONTENT } from 'http-status-codes';
import morgan from 'morgan';
import helmet from 'helmet';
import { handleError } from './error';
import Routes from './routes';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './config/swagger.json';

const app = express();

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

// passport configuration
// app.use(passport.initialize());
// passport.use(passportMiddleware);

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(Routes);

// managge errors
app.use((err: any, req: Request, res: Response, next: Function) => {
    handleError(err, res);
});

//fallback routes
app.all('*', (req, res) => res.status(NO_CONTENT).send());

export default app;