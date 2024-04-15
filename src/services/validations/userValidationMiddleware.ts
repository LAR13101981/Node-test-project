import { Request, Response, NextFunction } from 'express';
import { UserValidation } from './userValidationSchema';
import { ValidationResult } from 'joi';

export const validateSignUp = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userData = req.body;

  // Validating user creation data
  const validationResult: ValidationResult = UserValidation.signUp.validate(
    userData,
    { abortEarly: false }
  );

  if (validationResult.error) {
    const validationErrors = validationResult.error.details.map((error) => ({
      message: error.message,
      path: error.path.join('.'),
    }));

    // Respond with validation errors
    return res.status(400).json({
      errors: validationErrors,
      message: 'Validation Error',
    });
  }

  next();
};

export const validateSignIn = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userData = req.body;
  const validationResult: ValidationResult = UserValidation.signIn.validate(
    userData,
    { abortEarly: false }
  );

  if (validationResult.error) {
    const validationErrors = validationResult.error.details.map((error) => ({
      message: error.message,
      path: error.path.join('.'),
    }));

    // Respond with validation errors
    return res.status(400).json({
      errors: validationErrors,
      message: 'Validation Error',
    });
  }

  next();
};
