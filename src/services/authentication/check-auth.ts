import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_KEY = process.env.JWT_KEY;

export const checkToken: RequestHandler = async (req, res, next) => {
  try {
    const header = req.header('Authorization');
    if (!header || !JWT_KEY) {
      throw new Error(`Authorization failed`);
    }
    const [bearer, token] = header.split(' ');

    if (!token || bearer !== 'Bearer') {
      throw new Error('Invalid authorization header format');
    }

    let userData = await jwt.verify(token, JWT_KEY);

    //@ts-ignore
    req.user = userData;

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Failed to authenticate token' });
  }
};
