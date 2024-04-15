import Joi from 'joi';

export class PostValidation {
  static createPost = Joi.object({
    title: Joi.string().required().min(3),
    content: Joi.string().required().min(10),
  });
}
