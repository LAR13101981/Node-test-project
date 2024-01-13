import { Model } from 'mongoose';
import { Post } from './posts.mongo';
import { ValidationResult } from 'joi';
import { PostValidation } from '../services/validations/postValidations';
import { User } from './users.mongo';

export class PostClass {
  private model: Model<Post>;

  constructor(model: Model<Post>) {
    this.model = model;
  }

  async createNewPost(postData: Post, currentUser: User) {
    try {
      if (!postData || !currentUser) {
        throw new Error('Argument is missing');
      }

      const validationResult: ValidationResult =
        PostValidation.createPost.validate(postData);
      if (validationResult.error) {
        throw new Error(`Validation Error: ${validationResult.error.details}`);
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

      const isLiked = existingPost.likes.includes(currentUser.id);

      if (isLiked) {
        existingPost.likes = existingPost.likes.filter(
          (userId) => userId.toString() !== currentUser._id
        );
      } else {
        existingPost.likes.push(currentUser._id);
      }

      await existingPost.save();

      return existingPost;
    } catch (error) {
      throw new Error(`Failed to like/unlike post: ${error}`);
    }
  }

  async getAllUserPosts(userData: User) {
    try {
    } catch (error) {
      throw new Error(`Failed to create post: ${error}`);
    }
  }
}
