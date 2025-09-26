jest.mock('../../utils/appwrite.ts', () => ({
  account: {},
  OAuthProvider: { Google: 'google' },
}));

import dotenv from 'dotenv';
dotenv.config();

import request from 'supertest';
import mongoose, { Types } from 'mongoose';
import bcrypt from 'bcrypt';
import app from '../../app';
import User from '../models/users.models';

interface AdminUser {
  _id: Types.ObjectId;
  username: string;
  hashedPassword: string;
  roles: string[];
  email: string;
  name: string;
  passwordPlain?: string;
}

let seededAdmin: AdminUser;
// let adminToken: string;
// let userToken: string;
// let normalUserId: string;

beforeAll(async () => {
  if (!process.env.MONGODB_TEST_URI) {
    throw new Error('MONGODB_TEST_URI environment variable is required');
  }
  await mongoose.connect(process.env.MONGODB_TEST_URI);
  await mongoose.connection.collection('users').deleteMany({});

  // Seed admin user
  const plainPassword = 'Passw0rd!';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  seededAdmin = (await User.create({
    username: 'admin1',
    hashedPassword,
    roles: ['ADMIN'],
    email: 'admin@example.com',
    name: 'Admin User',
  })) as AdminUser;
  seededAdmin.passwordPlain = plainPassword;

  // Login seeded admin to get token
  const loginRes = await request(app)
    .post('/api/auth')
    .send({
      username: seededAdmin.username,
      password: seededAdmin.passwordPlain,
    });
  expect(loginRes.status).toBe(200);
  // adminToken = loginRes.body.data.token;

  // Create normal user via API (using admin token if needed for authorization)
  const userRes = await request(app)
    .post('/api/users/signup/user')
    .send({
      username: 'normaluser',
      password: 'Passw0rd!',
      email: 'normaluser@example.com',
    });
  expect(userRes.status).toBe(201);
  // normalUserId = userRes.body.data.id || userRes.body.data._id;

  // Login normal user to get token
  const loginUserRes = await request(app)
    .post('/api/auth')
    .send({ username: 'normaluser', password: 'Passw0rd!' });
  expect(loginUserRes.status).toBe(200);
  // userToken = loginUserRes.body.data.token;
});

afterAll(async () => {
  await mongoose.connection.collection('users').deleteMany({});
  await mongoose.disconnect();
});

describe('Auth controller tests', () => {
  describe('POST /api/auth (login)', () => {
    it('should fail if username is missing', async () => {
      const res = await request(app).post('/api/auth').send({ password: 'Passw0rd!' });
      expect(res.status).toBe(400);
      expect(res.body.status).toBe(false);
      expect(res.body.message).toMatch(/validation failed/i);
      expect(res.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ path: ['username'] }),
        ])
      );
    });

    it('should fail if password is missing', async () => {
      const res = await request(app).post('/api/auth').send({ username: 'admin1' });
      expect(res.status).toBe(400);
      expect(res.body.status).toBe(false);
      expect(res.body.message).toMatch(/validation failed/i);
      expect(res.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ path: ['password'] }),
        ])
      );
    });

    it('should fail if user not found', async () => {
      const res = await request(app)
        .post('/api/auth')
        .send({ username: 'notexist', password: 'Passw0rd!' });
      expect(res.status).toBe(401);
      expect(res.body.status).toBe(false);
      expect(res.body.data).toMatch(/invalid username or password/i);
    });

    it('should fail if password is incorrect', async () => {
      const res = await request(app)
        .post('/api/auth')
        .send({ username: 'admin1', password: 'wrongpassword' });
      expect(res.status).toBe(401);
      expect(res.body.status).toBe(false);
      expect(res.body.message || res.body.data).toMatch(/invalid username or password/i);
    });

    it('should login successfully and return token and user info', async () => {
      const res = await request(app)
        .post('/api/auth')
        .send({ username: 'admin1', password: 'Passw0rd!' });
      expect(res.status).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user).toMatchObject({
        username: 'admin1',
        email: 'admin@example.com',
        roles: ['ADMIN'],
      });
    });
  });

  describe('GET /api/auth/google/url/login', () => {
    it('should return google oauth login url', async () => {
      const res = await request(app).get('/api/auth/google/url/login');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('url');
      expect(res.body.url).toContain('accounts.google.com');
      expect(res.body.url).toContain(process.env.GOOGLE_CLIENT_ID!);
    });
  });

  describe('GET /api/auth/google/url/signup', () => {
    it('should return google oauth signup url', async () => {
      const res = await request(app).get('/api/auth/google/url/signup');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('url');
      expect(res.body.url).toContain('accounts.google.com');
      expect(res.body.url).toContain(process.env.GOOGLE_CLIENT_ID!);
    });
  });
});

describe('POST /api/auth/appwrite/sync', () => {

  it('should fail if email is missing', async () => {
    const res = await request(app).post('/api/auth/appwrite/sync').send({ name: 'New User' });
    expect(res.status).toBe(400);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toMatch(/validation failed/i);
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: ['email'] }),
      ])
    );
  });

  it('should create a new user and return token', async () => {
    const res = await request(app)
      .post('/api/auth/appwrite/sync')
      .send({ email: 'appwriteuser@example.com' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data.user).toMatchObject({
      username: 'appwriteuser',
      name: 'appwriteuser',
      email: 'appwriteuser@example.com',
      roles: ['USER'],
    });

    // Optional: verify user was actually created in DB
    const dbUser = await User.findOne({ email: 'appwriteuser@example.com' });
    expect(dbUser).not.toBeNull();
  });

  it('should sync an existing user without creating duplicate', async () => {
    // First call to create
    await request(app).post('/api/auth/appwrite/sync').send({ name: 'Appwrite User 2', email: 'appwriteuser2@example.com' });

    // Second call should find existing user
    const res = await request(app).post('/api/auth/appwrite/sync').send({ name: 'Appwrite User 2', email: 'appwriteuser2@example.com' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.data.user.email).toBe('appwriteuser2@example.com');

    // Check DB: still only 1 user with that email
    const count = await User.countDocuments({ email: 'appwriteuser2@example.com' });
    expect(count).toBe(1);
  });
});
