import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = await mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

let userToken = '';

describe('POST / sign up user endpoint', () => {
  it('Should create a new user and respond with 201 status', async () => {
    const userData = {
      userName: 'testuser',
      firstName: 'fistnametest',
      lastName: 'lastnametest',
      password: 'testpassword',
      email: 'test@example.com',
    };

    const response = await request(app).post('/users').send(userData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('newUser');
    expect(response.body.newUser).toHaveProperty('userName', 'testuser');
  });

  it('should return an error if user with same name or email already exists with 400 status', async () => {
    const existingUser = {
      userName: 'existinguser',
      firstName: 'Existing',
      lastName: 'User',
      password: 'test123',
      email: 'existing@example.com',
    };

    // First create a user with the same data before attempting to create again
    await request(app).post('/users/signup').send(existingUser);

    const response = await request(app)
      .post('/users/signup')
      .send(existingUser);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain(
      'User name or email address already exists'
    );
  });

  it('Should return an error if required data field are missing or not long enough with 400 status', async () => {
    const invalidUserData = {
      userName: 'a',
      firstName: 'John',
      lastName: 'Doe',
      password: 'test123',
      email: 'john@example.com',
    };

    const response = await request(app)
      .post('/users/signup')
      .send(invalidUserData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('Validation Error');
  });
});

describe('POST / Sign in user endpoint', () => {
  it('Should sign in a user and return a token and 202 status ', async () => {
    const userData = {
      userName: 'testuser',
      firstName: 'fistnametest',
      lastName: 'lastnametest',
      password: 'testpassword',
      email: 'test@example.com',
    };

    await request(app).post('/users/signup').send(userData);

    const userLogIn = {
      userName: 'testuser',
      password: 'testpassword',
    };

    const response = await request(app).post('/users/signin').send(userLogIn);

    expect(response.status).toBe(202);
    expect(response.body).toHaveProperty('token');
    userToken = response.body.token;
    expect(response.body).toHaveProperty('message');
  });

  it('Should log in user and respond with 401 status for invalid credentials', async () => {
    const userLogIn = {
      userName: 'nonexistentuser',
      password: 'invalidpassword',
    };

    const response = await request(app).post('/users/signin').send(userLogIn);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });
});

describe('DELETE / user endpoint', () => {
  it('Should delete an existing user and return a 200 status', async () => {
    expect(userToken).not.toBe('');

    const deleteUser = {
      userName: 'testuser',
      email: 'test@example.com',
    };

    const response = await request(app)
      .delete('/users/userdelete')
      .set('Authorization', `Bearer ${userToken}`)
      .send(deleteUser);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
  });
});
