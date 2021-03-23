import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import Useragent from 'express-useragent';
import Central from './routes/center';
import NotFound from './middlewares/404';
import monitorMiddleware from './middlewares/monitor';

const Express = express();

const { API_VERSION, MONITORING_SERVICE_PORT } = process.env;

Express.use(Useragent.express());

Express.use(express.static(path.join(__dirname, './public')));

Express.set('trust proxy', true);

Express.use(helmet());

Express.use(cors({
    origin: /\:3000$/,
    credentials: true
}));

Express.use(express.json());

// Express.use(monitorMiddleware);

Express.use(Central);

Express.use(NotFound);


export default Express;
