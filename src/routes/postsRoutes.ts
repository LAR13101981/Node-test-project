import { Router } from 'express';
import { checkToken } from '../services/authentication/check-auth';
import {
  httpCreatePost,
  httpLikeUnlikePost,
} from '../controllers/postController';
import { validatePost } from '../services/validations/postValidationMiddleare';

const postRouter = Router();

postRouter.post('/createpost', checkToken, validatePost, httpCreatePost);
postRouter.patch('/likeunlike', checkToken, httpLikeUnlikePost);

export default postRouter;
