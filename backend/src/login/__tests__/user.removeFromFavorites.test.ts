// tests/user.removeFromFavorites.test.ts
import dotenv from 'dotenv';
dotenv.config();
import request from 'supertest';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import app from '../../app';
import User from '../../login/models/users.models';
import Commodity from '../../stripe/models/commodity.models';

if (!process.env.MONGODB_TEST_URI) {
  throw new Error('MONGODB_TEST_URI is required');
}
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required');
}

let adminToken = '';
let userToken = '';
let userId = '';
let commodityId = '';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_TEST_URI!);
  await User.deleteMany({});
  await Commodity.deleteMany({});

  // 👤 Create admin
  const hashedAdminPassword = await bcrypt.hash('Passw0rd!', 10);
  const admin = await User.create({
    username: 'admin-remove-favorites',
    hashedPassword: hashedAdminPassword,
    roles: ['ADMIN'],
    email: 'admin-remove-favorites@example.com',
    name: 'Admin Remove Fav',
  });
  adminToken = jwt.sign(
    {
      id: admin._id.toString(),
      username: admin.username,
      email: admin.email,
      roles: admin.roles,
    },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );

  // 👤 Create normal user
  const hashedUserPassword = await bcrypt.hash('Passw0rd!', 10);
  const normalUser = await User.create({
    username: 'normal-remove-fav-user',
    hashedPassword: hashedUserPassword,
    roles: ['USER'],
    email: 'normal-remove-fav@example.com',
    name: 'Normal Remove Fav User',
  });
  userId = normalUser._id.toString();

  userToken = jwt.sign(
    {
      id: normalUser._id.toString(),
      username: normalUser.username,
      email: normalUser.email,
      roles: normalUser.roles,
    },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );

  // 🛒 Commodity
  const commodity = await Commodity.create({
    name: 'Commodity To Remove',
    price: 100,
    currency: 'eur',
    stripePriceId: 'price_remove_fav_test',
  });
  commodityId = commodity._id.toString();

  // Pre-add favorite so removal makes sense
  await request(app)
    .post(`/api/users/${userId}/favorites`)
    .set('Authorization', `Bearer ${userToken}`)
    .send({ commodityId });
});

afterAll(async () => {
  await Commodity.deleteMany({});
  await User.deleteMany({});
  await mongoose.disconnect();
});

describe('DELETE /api/users/:id/favorites (remove)', () => {
  it('401 if no token', async () => {
    const res = await request(app)
      .delete(`/api/users/${userId}/favorites`)
      .send({ commodityId });
    expect(res.status).toBe(401);
  });

  it('403 if wrong user and not admin', async () => {
    const stranger = await User.create({
      username: 'stranger-remove-fav',
      hashedPassword: await bcrypt.hash('Passw0rd!', 10),
      roles: ['USER'],
      email: 'stranger-remove-fav@example.com',
      name: 'Stranger Remove Fav',
    });

    const strangerToken = jwt.sign(
      {
        id: stranger._id.toString(),
        username: stranger.username,
        email: stranger.email,
        roles: stranger.roles,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    const res = await request(app)
      .delete(`/api/users/${userId}/favorites`)
      .set('Authorization', `Bearer ${strangerToken}`)
      .send({ commodityId });

    expect(res.status).toBe(403);
  });

  it('400 if no commodityId provided', async () => {
    const res = await request(app)
      .delete(`/api/users/${userId}/favorites`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/commodityId required/);
  });

  it('200 if self → removes favorite', async () => {
    const res = await request(app)
      .delete(`/api/users/${userId}/favorites`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ commodityId });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe(true);
    const favorites: string[] = res.body.data.favorites;
    expect(favorites).not.toContain(commodityId);
  });

  it('200 if admin → removes favorite of another user', async () => {
    // Re-add so admin can remove
    await request(app)
      .post(`/api/users/${userId}/favorites`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ commodityId });

    const res = await request(app)
      .delete(`/api/users/${userId}/favorites`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ commodityId });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe(true);
    const favorites: string[] = res.body.data.favorites;
    expect(favorites).not.toContain(commodityId);
  });

  it('200 if commodity not in favorites (idempotent removal)', async () => {
    const res = await request(app)
      .delete(`/api/users/${userId}/favorites`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ commodityId });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.favorites)).toBe(true);
    expect(res.body.data.favorites).not.toContain(commodityId);
  });
});

// 👀 SpyOn tests (separate describe)
describe('userDAO.update (spy)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls update once with favorites field', async () => {
    const spy = jest.spyOn(User, 'findByIdAndUpdate').mockResolvedValueOnce({
      _id: new mongoose.Types.ObjectId(userId),
      username: 'mock-user',
      roles: ['USER'],
      favorites: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      email: 'mock@example.com',
      hashedPassword: 'hashed',
    } as any);

    const res = await request(app)
      .delete(`/api/users/${userId}/favorites`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ commodityId });

    expect(res.status).toBe(200);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][1]).toHaveProperty('favorites');
  });

  it('handles DAO error gracefully', async () => {
    jest.spyOn(User, 'findByIdAndUpdate').mockRejectedValueOnce(new Error('DB fail'));
    const res = await request(app)
      .delete(`/api/users/${userId}/favorites`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ commodityId });

    expect(res.status).toBe(500);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toMatch(/DB fail/);
  });
});
