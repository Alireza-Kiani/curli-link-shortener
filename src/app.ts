import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import fetch from 'node-fetch';
import Useragent from 'express-useragent';
import Central from './routes/center';
import NotFound from './middlewares/404';

const Express = express();

const { API_VERSION } = process.env;

Express.use(Useragent.express());

Express.use(express.static(path.join(__dirname, './public')));

Express.set('trust proxy', true);

Express.use(helmet());

Express.use(cors({
    origin: /\:3000$/,
    credentials: true
}));

Express.use(express.json());

Express.use((req, res, next) => {
    try {
        fetch(`http://curli.ir:8082/api/v${API_VERSION}/saveSite`, {
            method: 'POST',
            body: JSON.stringify({
                domain: `curli.ir`,
                ip: req.ip,
                useragent: req.useragent
            }),
            headers: {
                'content-type': 'application/json'
            },
            redirect: 'follow'
        })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.log(err));
    } catch (e) {
        console.log(e);
    } finally {
        next();
    }
});

Express.use(Central);

Express.use(NotFound);


export default Express;
