import express from 'express';
import path from 'path';
import cors from 'cors';
import Central from './routes/center';

const Express = express();
// const { API_VERSION } = process.env;

Express.use(express.static(path.join(__dirname, './public')));

Express.use(cors({
    origin: /\:3000$/,
    credentials: true
}));

Express.use(express.json());

Express.use(Central);


export default Express;