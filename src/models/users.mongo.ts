import mongoose, { Document, Model, Schema } from 'mongoose';
import { Post } from './posts.mongo';

export interface User extends Document {
  userName: string;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  createdAt: Date;
  posts: Post[];
  following: User[];
  followers: User[];
}

const usersSchema: Schema<User> = new Schema<User>({
  userName: {
    type: String,
    unique: true,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

export const user: Model<User> = mongoose.model('User', usersSchema);
