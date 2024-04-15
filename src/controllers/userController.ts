import { RequestHandler } from 'express';
import { UserClass } from '../models/users.model';
import userRouter from '../routes/userRoutes';
import { user } from '../models/users.mongo';

export const userInstance = new UserClass(user);

export const httpCreateUser: RequestHandler = async (req, res) => {
  try {
    const newUser = await userInstance.createNewUser(req.body);

    res.status(201).json({ message: 'User Created', newUser });
  } catch (error) {
    console.error('Error in POST request handler:', error);
    res.status(400).json({ error: `${error}` });
  }
};

export const httpSigninUser: RequestHandler = async (req, res) => {
  try {
    const token = await userInstance.signInUser(req.body);

    res.status(202).json({ message: 'Succesfully logged in', token });
  } catch (error) {
    res.status(401).json({ error: `${error}` });
  }
};

export const httpGetUserInfo: RequestHandler = async (req, res) => {
  try {
    const userInfo = await userInstance.getUserInfo(req.user);

    res.status(200).json({ messange: 'Here is your User Data', userInfo });
  } catch (error) {
    res.status(400).json({ error: `${error}` });
  }
};

export const httpDeleteUser: RequestHandler = async (req, res) => {
  try {
    const user = await userInstance.deleteUser(req.body);

    res.status(200).json({ message: 'User Deleted' });
  } catch (error) {
    res.status(400).json({ error: `${error}` });
  }
};

export const httpFollowUnfollowUsers: RequestHandler = async (req, res) => {
  try {
    const signInUser = req.user;
    const targetUser = req.body;

    await userInstance.followUnfollowUser(signInUser, targetUser);

    res.status(202).json({ message: 'User followed/Unfollowed' });
  } catch (error) {
    res.status(400).json({ error: `${error}` });
  }
};
