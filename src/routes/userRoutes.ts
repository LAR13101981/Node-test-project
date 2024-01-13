import { Router } from 'express';
import {
  httpCreateUser,
  httpSigninUser,
  httpFollowUnfollowUsers,
  httpGetUserInfo,
  httpDeleteUser,
} from '../controllers/userController';
import { checkToken } from '../services/authentication/check-auth';

const userRouter = Router();

userRouter.post('/signup', httpCreateUser);
userRouter.post('/signin', httpSigninUser);
userRouter.patch('/followunfollow', checkToken, httpFollowUnfollowUsers);
userRouter.get('/myinfo', checkToken, httpGetUserInfo);
userRouter.delete('/userdelete', checkToken, httpDeleteUser);

export default userRouter;
