import { Router } from 'express';
import ApiController from '../../controller/api';
import RateLimit from '../../middlewares/rateLimit';

const ApiRouter = Router();

ApiRouter.get('/:url', ApiController.redirectLink);

ApiRouter.post('/shortener', RateLimit, ApiController.createLink);

export default ApiRouter;