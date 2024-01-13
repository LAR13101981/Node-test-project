import { Model } from 'mongoose';
import { Comment } from './comments.mongo';
import { User } from './users.mongo';
import { post } from './posts.mongo';

export class CommentClass {
  private model: Model<Comment>;

  constructor(model: Model<Comment>) {
    this.model = model;
  }

  async createNewComment(commentData: Comment, userData: User) {
    try {
      if (!commentData || !userData) {
        throw new Error('Argument missing');
      }
      //Finding post by title
      const existingPost = await post.findOne({ title: commentData.postTitle });

      if (!existingPost) {
        throw new Error('Post not found');
      }
      if (commentData.content.length > 100) {
        commentData.content = commentData.content.substring(0, 100);
      }

      // Creating the comment document
      const newComment = new this.model({
        author: userData._id,
        content: commentData.content,
        postTitle: existingPost._id,
      });

      // Saving the comment
      const createdComment = await newComment.save();

      // Adding commment id to the post comment array
      existingPost.comments.push(createdComment._id);
      await existingPost.save();

      return createdComment.content;
    } catch (error) {
      throw new Error(`Failed to create a new comment: ${error}`);
    }
  }
}
