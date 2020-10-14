import express from 'express';
import path from 'path';
import cors from 'cors';
import Central from './routes/center';
import NotFound from './middlewares/404';

const Express = express();
// const { API_VERSION } = process.env;

Express.use(express.static(path.join(__dirname, './public')));

Express.use(cors({
    origin: /\:3000$/,
    credentials: true
}));

Express.use(express.json());

Express.use((req, res, next) => {
    console.log(req.ips, req.hostname);
    console.log(req.connection.remoteAddress);
    next();
});

Express.use(Central);

Express.use(NotFound);


export default Express;