import path from 'path';
import { RequestHandler } from 'express';

const NotFound: RequestHandler = async (req, res, next) => {
    return res.status(404).sendFile(path.join(__dirname, '../public/404.html'));
}


export default NotFound;