import { RequestHandler } from 'express';
import { PostClass } from '../models/posts.model';
import { post } from '../models/posts.mongo';
import { userInstance } from './userController';

export const postInstance = new PostClass(post);

export const httpCreatePost: RequestHandler = async (req, res) => {
  try {
    const postData = req.body;
    const userData = req.user;

    const newPost = await postInstance.createNewPost(postData, userData);

    const updateUser = await userInstance.updateUserPosts(
      userData,
      newPost._id
    );

    res.status(201).json({ message: 'Post Created', newPost });
  } catch (error) {
    res.status(401).json({ error: `${error}` });
  }
};

export const httpLikeUnlikePost: RequestHandler = async (req, res) => {
  try {
    const currentUser = req.user;
    const postData = req.body;
    await postInstance.likeUnlikePost(postData, currentUser);

    res.status(201).json({ message: 'Post liked / unliked' });
  } catch (error) {
    res.status(401).json({ error: `${error}` });
  }
};

export const httpGetAllUserPosts: RequestHandler = async (req, res) => {
  try {
    const userData = req.user;

    const getPosts = await postInstance.getAllUserPosts(userData);
  } catch (error) {
    res.status(401).json({ error: `${error}` });
  }
};
