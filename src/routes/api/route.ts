import { Router } from 'express';
import ApiController from '../../controller/api';

const ApiRouter = Router();

ApiRouter.get('/:url', ApiController.redirectLink);

ApiRouter.post('/shortener', ApiController.createLink);

export default ApiRouter;