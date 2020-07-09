import compression from 'compression';
import cors from 'cors';
import http, { Server } from 'http';
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
import config from '@Config/index';

const isProd = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

export const app = express();
export const server: Server = http.createServer(app);

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
    // app.use(require('express-status-monitor')());
}

//private dashboard stats
if (!isTest) {
    app.use(
        swStats.getMiddleware({
            swaggerSpec: swaggerDocument,
            authentication: true,
            onAuthenticate: (req, username, password) =>
                username === config.SWAGGER.USER &&
                password === config.SWAGGER.PASSWORD,
        })
    );
    app.use(rateLimiterMiddleware);
}

app.use(Routes);

// errors handler
app.use(handleErrorMiddleware);

//fallback routes
app.all('*', (req, res) => res.status(NO_CONTENT).send());
