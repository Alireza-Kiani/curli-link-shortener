import { Router } from 'express';
import ApiController from '../../controller/api';

const ApiRouter = Router();

ApiRouter.post('/shortener', ApiController.createLink);

ApiRouter.get('/?url', ApiController.redirectLink);

export default ApiRouter;