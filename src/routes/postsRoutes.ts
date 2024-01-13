import { Router } from 'express';
import { checkToken } from '../services/authentication/check-auth';
import {
  httpCreatePost,
  httpLikeUnlikePost,
  httpGetAllUserPosts,
} from '../controllers/postController';

const postRouter = Router();

postRouter.post('/createpost', checkToken, httpCreatePost);
postRouter.get('/getuserposts', checkToken, httpGetAllUserPosts);
postRouter.patch('/likeunlike', checkToken, httpLikeUnlikePost);

export default postRouter;
