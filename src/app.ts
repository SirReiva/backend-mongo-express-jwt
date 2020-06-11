import compression from 'compression';
import cors from 'cors';
import http from 'http';
import express from 'express';
import { NO_CONTENT } from 'http-status-codes';
import morgan from 'morgan';
import helmet from 'helmet';
import Routes from '@Routes/index';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from '@Config/swagger.json';
import { handleErrorMiddleware } from '@Error/index';
import { rateLimiterMiddleware } from '@Middlewares/rate.middleware';
import * as swStats from 'swagger-stats';
import { BasicAuthGuard } from '@Middlewares/basicAuth.middleware';

const isProd = process.env.NODE_ENV === 'production';

export const app = express();
export const server = http.createServer(app);

app.use(rateLimiterMiddleware);
app.use(cors());
app.use(helmet());
app.use(compression()); // nginx better

app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json());

if (!isProd) {
    app.use(morgan('dev'));
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use(require('express-status-monitor')());
    app.use(
        BasicAuthGuard,
        swStats.getMiddleware({ swaggerSpec: swaggerDocument })
    );
}

app.use(Routes);

// errors handler
app.use(handleErrorMiddleware);

//fallback routes
app.all('*', (req, res) => res.status(NO_CONTENT).send());
