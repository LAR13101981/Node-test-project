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

describe('POST / Create a new post endpoint', () => {
  it('Should create a new post and return with 201 status', async () => {
    await request(app).put('/users').send(userData);

    const userLogIn = {
      userName: 'testuser',
      password: 'testpassword',
    };

    const logInResponse = await request(app).post('/users').send(userLogIn);
    userToken = logInResponse.body.token;

    const userPost = {
      title: 'Lo que el viento se llevo',
      content:
        'Lo que el viento se llevo es un libro en el cual se baso la famosa pelicula del anio 1939.',
    };

    const response = await request(app)
      .post('/posts/createpost')
      .send(userPost)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('newPost');
  });

  it('Should return an error if token is missing with 401 status', async () => {
    const postData = {
      title: 'Lo que el viento se llevo',
      content:
        'Lo que el viento se llevo es un libro en el cual se baso la famosa pelicula del anio 1939.',
    };

    const response = await request(app)
      .post('/posts/createpost')
      .send(postData);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

  it('Should return an error if postData is missing with 401 status', async () => {
    const postData = {};

    const response = await request(app)
      .post('/posts/createpost')
      .send(postData)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });
});

describe('PATCH / like & unlike post endpoint', () => {
  it('Should add a like to an existing user post with 201 status', async () => {
    const userData = {
      userName: 'testuser2',
      firstName: 'fistnametest2',
      lastName: 'lastnametest2',
      password: 'testpassword2',
      email: 'test2@example.com',
    };

    await request(app).put('/users').send(userData);

    const userLogIn = {
      userName: 'testuser2',
      password: 'testpassword2',
    };

    const logInResponse = await request(app).post('/users').send(userLogIn);

    userToken = logInResponse.body.token;

    const postData = { title: 'Lo que el viento se llevo' };

    const response = await request(app)
      .patch('/posts/likeunlike')
      .send(postData)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message');
  });
});
