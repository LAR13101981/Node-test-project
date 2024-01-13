import { RequestHandler } from 'express';
import { CommentClass } from '../models/comments.model';
import { comment } from '../models/comments.mongo';

const commentInstance = new CommentClass(comment);

export const httpcreatecomment: RequestHandler = async (req, res) => {
  try {
    const commentData = req.body;
    const userData = req.user;

    const newcomment = await commentInstance.createNewComment(
      commentData,
      userData
    );
    res.status(201).json({ message: 'Comment created', newcomment });
  } catch (error) {
    res.status(401).json({ error: `${error}` });
  }
};
