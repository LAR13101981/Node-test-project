import { Router } from 'express';
import {
  httpCreateUser,
  httpSigninUser,
  httpFollowUnfollowUsers,
  httpGetUserInfo,
  httpDeleteUser,
} from '../controllers/userController';
import { checkToken } from '../services/authentication/check-auth';
import {
  validateSignUp,
  validateSignIn,
} from '../services/validations/userValidationMiddleware';

const userRouter = Router();

userRouter.put('/', validateSignUp, httpCreateUser);
userRouter.post('/signin', validateSignIn, httpSigninUser);
userRouter.patch('/followunfollow', checkToken, httpFollowUnfollowUsers);
userRouter.get('/myinfo', checkToken, httpGetUserInfo);
userRouter.delete('/userdelete', checkToken, httpDeleteUser);

export default userRouter;
