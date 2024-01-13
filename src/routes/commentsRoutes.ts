import { Router } from 'express';
import { checkToken } from '../services/authentication/check-auth';
import { httpcreatecomment } from '../controllers/commentController';

const commentRoutes = Router();

commentRoutes.post('/createcomment', checkToken, httpcreatecomment);

commentRoutes.delete('/');

export default commentRoutes;
