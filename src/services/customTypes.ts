import { User } from '../models/users.mongo';

declare global {
  namespace Express {
    export interface Request {
      user: User;
    }
  }
}
