import { User } from './users.mongo';
import { Model } from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Post } from './posts.mongo';

dotenv.config();
const JWT_KEY = process.env.JWT_KEY;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;

export class UserClass {
  private model: Model<User>;

  constructor(model: Model<User>) {
    this.model = model;
  }
  async findUserByName(userData: User): Promise<User> {
    try {
      const existingUser = await this.model.findOne({
        userName: userData.userName,
      });
      if (!existingUser) throw new Error('User not found');
      return existingUser;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  // Method to register a new User
  async createNewUser(userData: User): Promise<User> {
    try {
      // Check if the user with the same email or username already exists
      const existingUser = await this.model.findOne(
        { email: userData.email },
        { userName: userData.userName }
      );

      if (existingUser) {
        throw new Error('User name or email address already exists.');
      }

      // Encrypting password with bcryptjs
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      // Saving the new user with encrypted password
      const newUser = new this.model({ ...userData, password: hashedPassword });
      return await newUser.save();
    } catch (error) {
      console.error('Error in registerNewUser:', error);
      throw new Error(`Failed to register user: ${error}`);
    }
  }

  async signInUser(userData: User): Promise<string> {
    try {
      // Check if the user with the same username already exists
      const existingUser = await this.model.findOne({
        userName: userData.userName,
      });

      if (!existingUser) {
        throw new Error('Authentication error.');
      }

      const passwordMatch = await bcrypt.compare(
        userData.password,
        existingUser.password
      );

      if (!passwordMatch) {
        throw new Error('Authentication error.');
      }
      if (!JWT_KEY) {
        throw new Error('JWT_KEY is not defined');
      }
      const token = jwt.sign(
        {
          userName: existingUser.userName,
          _id: existingUser._id,
        },
        JWT_KEY,
        { expiresIn: JWT_EXPIRATION }
      );

      return token;
    } catch (error) {
      throw new Error(`Failed to log in, ${error}`);
    }
  }

  // Method to get User information
  async getUserInfo(userData: User): Promise<User> {
    try {
      const existingUser = await this.findUserByName(userData);
      return existingUser;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  // Method to delete an existing User
  async deleteUser(userData: User): Promise<User> {
    try {
      // Checking if both userName and email exists in DB
      const existingUser = await this.findUserByName(userData);

      if (!existingUser) {
        throw new Error('Invalid username or email, try again');
      }
      //Deleting existing user
      return await existingUser.deleteOne({ _id: existingUser._id });
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  // Method to follow / unfollow another user
  async followUnfollowUser(currentUser: User, userData: User) {
    try {
      const signInUser = await this.findUserByName(currentUser);
      const targetUser = await this.findUserByName(userData);

      const isFollowing = signInUser.following.includes(targetUser._id);

      if (isFollowing) {
        await this.model.updateOne(
          { _id: signInUser._id },
          { $pull: { following: targetUser._id } }
        );
        await this.model.updateOne(
          { _id: targetUser._id },
          { $pull: { followers: signInUser._id } }
        );
      } else {
        await this.model.updateOne(
          { _id: signInUser._id },
          { $addToSet: { following: targetUser._id } }
        );
        await this.model.updateOne(
          { _id: targetUser._id },
          { $addToSet: { followers: signInUser._id } }
        );
      }
    } catch (error) {
      throw new Error(`Failed to follow/unfollow user: ${error}`);
    }
  }

  // Method to update the user posts property
  async updateUserPosts(userData: User, postID: Post) {
    try {
      const existingUser = await this.findUserByName(userData);

      // Update the user's posts array with the created post's ID
      existingUser.posts.push(postID);

      // Save the updated user object
      await existingUser.save();
    } catch (error) {
      console.error('Error in updateUserPosts:', error);
      throw new Error(`Failed to update user posts: ${error}`);
    }
  }
}
