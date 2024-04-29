import { Model } from 'mongoose';
import { Post } from './posts.mongo';
import { User } from './users.mongo';

export class PostClass {
  private model: Model<Post>;

  constructor(model: Model<Post>) {
    this.model = model;
  }

  async createNewPost(postData: Post, currentUser: User) {
    try {
      if (!currentUser) {
        throw new Error('There is no user');
      }

      if (!postData.content) {
        throw new Error('This post has no content');
      }
      if (!postData.title) {
        throw new Error('This post is missing a title');
      }

      if (postData.content.length > 100) {
        postData.content = postData.content.substring(0, 100);
      }

      const newPost = new this.model({
        ...postData,
        author: currentUser._id,
      });

      const createdPost = await newPost.save();

      return createdPost;
    } catch (error) {
      console.error('Error in createNewPost:', error);
      throw new Error(`Failed to create post: ${error}`);
    }
  }

  async likeUnlikePost(postData: Post, currentUser: User) {
    try {
      if (!postData || !currentUser) {
        throw new Error('Missing Arguments');
      }
      const existingPost = await this.model.findOne({ title: postData.title });

      if (!existingPost) {
        throw new Error("Post title doesn't exists");
      }

      const postId = existingPost._id;

      const isLiked = await this.model.exists({
        _id: postId,
        likes: currentUser._id,
      });

      if (isLiked) {
        await this.model.updateOne(
          { _id: postId },
          { $pull: { likes: currentUser._id } }
        );
      } else {
        await this.model.updateOne(
          { _id: postId },
          { $addToSet: { likes: currentUser._id } }
        );
      }

      return existingPost;
    } catch (error) {
      throw new Error(`Failed to like/unlike post: ${error}`);
    }
  }
}
