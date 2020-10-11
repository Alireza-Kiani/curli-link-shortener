import express from 'express';
import path from 'path';
import Central from './routes/center';

const Express = express();
// const { API_VERSION } = process.env;


Express.use(express.json());

Express.use(Central);

Express.use(express.static(path.join(__dirname, './public')));

export default Express;