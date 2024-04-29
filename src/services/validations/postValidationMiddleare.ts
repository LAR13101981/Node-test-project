import { Request, Response, NextFunction } from 'express';
import { PostValidation } from './postValidationSchema';
import { ValidationResult } from 'joi';

export const validatePost = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const postData = req.body;

  if (!postData) {
    throw new Error('Post data missing');
  }

  //Validating Post Data
  const validationResult: ValidationResult =
    PostValidation.createPost.validate(postData);

  if (validationResult.error) {
    res.status(401).json({ error: `${Error}` });
    throw new Error(`Validation Error: ${Error}`);
  }

  next();
};
