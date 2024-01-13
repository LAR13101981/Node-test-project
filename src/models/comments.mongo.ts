import mongoose, { Document, Schema, Model, Date, model } from 'mongoose';
import { User } from './users.mongo';
import { Post } from './posts.mongo';

export interface Comment extends Document {
  author: User;
  commentOn: Post;
  content: string;
  date: Date;
}

const commentsSchema: Schema<Comment> = new Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  commentOn: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  },
});

export const comment: Model<Comment> = mongoose.model(
  'Comment',
  commentsSchema
);
