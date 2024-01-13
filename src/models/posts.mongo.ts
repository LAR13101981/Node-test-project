import mongoose, { Document, Model, Schema } from 'mongoose';
import { User } from './users.mongo';
import { Comment } from './comments.mongo';

export interface Post extends Document {
  title: string;
  content: string;
  createdAt: Date;
  author: User;
  likes: User[];
  comments: Comment[];
}

const postsSchema: Schema<Post> = new Schema<Post>({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
});

export const post: Model<Post> = mongoose.model<Post>('Post', postsSchema);
