import Joi from 'joi';

export class UserValidation {
  static signUp = Joi.object({
    userName: Joi.string().required().min(3).max(15),
    firstName: Joi.string().required().min(2).max(15),
    lastName: Joi.string().required().min(2).max(15),
    password: Joi.string().required().min(6).max(15),
    email: Joi.string().email().required(),
  });

  static signIn = Joi.object({
    userName: Joi.string().required().min(3).max(15),
    password: Joi.string().required().min(6).max(15),
  });

  static findUser = Joi.object({
    userName: Joi.string().required().min(3).max(15),
  });
}
