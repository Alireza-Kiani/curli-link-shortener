import { Router } from 'express';
import ApiRouter from './api/route';

const Central = Router();

Central.use('/', ApiRouter);

export default Central;