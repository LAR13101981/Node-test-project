import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;
let userToken: string;

const userData = {
  userName: 'testuser',
  firstName: 'fistnametest',
  lastName: 'lastnametest',
  password: 'testpassword',
  email: 'test@example.com',
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = await mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('PUT / sign up user endpoint', () => {
  it('Should create a new user and respond with 201 status', async () => {
    const response = await request(app).put('/users').send(userData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('newUser');
    expect(response.body.newUser).toHaveProperty('userName', 'testuser');
  });

  it('should return an error if user with same name or email already exists with 400 status', async () => {
    const response = await request(app).put('/users').send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain(
      'User name or email address already exists'
    );
  });

  it('Should return an error if required data field is missing with 400 status', async () => {
    const invalidUserData = {
      userName: '',
      firstName: 'John',
      lastName: 'Doe',
      password: 'test123',
      email: 'john@example.com',
    };

    const response = await request(app).put('/users').send(invalidUserData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('Validation Error');
  });

  it('Should return an error if email is not a valid mail format', async () => {
    const invalidUserMailData = {
      userName: 'TheJohn',
      firstName: 'John',
      lastName: 'Doe',
      password: 'test123',
      email: 'john123examplecom',
    };

    const response = await request(app).put('/users').send(invalidUserMailData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.message).toContain('Validation Error');
  });
});

describe('POST / Sign in user endpoint', () => {
  it('Should log in a user and return a token with 202 status ', async () => {
    const userLogIn = {
      userName: 'testuser',
      password: 'testpassword',
    };

    const response = await request(app).post('/users').send(userLogIn);

    expect(response.status).toBe(202);
    expect(response.body).toHaveProperty('token');
    userToken = response.body.token;
    expect(response.body).toHaveProperty('message');
  });

  it('Should return an error for invalid credentials for user name or password with 401 status', async () => {
    const userLogIn = {
      userName: 'nonexistentuser',
      password: 'invalidpassword',
    };

    const response = await request(app).post('/users').send(userLogIn);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });
});

describe('PATCH / user follow & unfollow endpoint', () => {
  it('Should follow / unfollow target user and return 202 status', async () => {
    const userToFollow = {
      userName: 'usertofollow',
      firstName: 'userto',
      lastName: 'follow',
      password: 'secondpassword',
      email: 'follow@example.com',
    };

    await request(app).put('/users').send(userToFollow);

    const response = await request(app)
      .patch('/users/followunfollow')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ userName: 'usertofollow' });

    expect(response.status).toBe(202);
    expect(response.body).toHaveProperty('message');
  });

  it('Should return an error if user to follow / unfollow doesnt exist', async () => {
    const response = await request(app)
      .patch('/users/followunfollow')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ userName: 'whatuser' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});

describe('/GET get all user info', () => {
  it('Should return all user information with 200 status', async () => {
    const response = await request(app)
      .get('/users/myinfo')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ userName: 'testuser' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('userInfo');
  });

  it('Should return an error if token is missing with status 401', async () => {
    const response = await request(app)
      .get('/users/myinfo')
      .send({ userName: 'testuser' });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });
});

describe('DELETE / user endpoint', () => {
  it('Should return an error if user name or email is invalid with 400 status', async () => {
    const deleteUser = {
      userName: 'notestuser',
      email: 'test@example.com',
    };

    const response = await request(app)
      .delete('/users/userdelete')
      .set('Authorization', `Bearer ${userToken}`)
      .send(deleteUser);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
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
