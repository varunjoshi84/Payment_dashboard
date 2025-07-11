const { Test } = require('@nestjs/testing');
const request = require('supertest');
const { AppModule } = require('../src/app.module');

describe('Payment Dashboard API (e2e)', () => {
  let app;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Add CORS and global prefix like in main.js
    app.enableCors();
    app.setGlobalPrefix('api');
    
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Health Check', () => {
    it('/api (GET) should return hello message', () => {
      return request(app.getHttpServer())
        .get('/api')
        .expect(200)
        .expect('Hello World! Database connection configured for MongoDB.');
    });
  });

  describe('Auth Endpoints', () => {
    it('/api/auth/register (POST) should create a new user', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user.username).toBe('testuser');
        });
    });

    it('/api/auth/login (POST) should login user', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'password123',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body).toHaveProperty('user');
        });
    });
  });

  describe('Seed Endpoints', () => {
    it('/api/seed/admin (POST) should create default admin', () => {
      return request(app.getHttpServer())
        .post('/api/seed/admin')
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('admin');
        });
    });

    it('/api/seed/payments (POST) should create sample payments', () => {
      return request(app.getHttpServer())
        .post('/api/seed/payments')
        .send({ userId: '507f1f77bcf86cd799439011' })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('payments');
          expect(Array.isArray(res.body.payments)).toBe(true);
        });
    });
  });

  describe('Protected Endpoints', () => {
    let token;

    beforeAll(async () => {
      // Login to get token for protected routes
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'admin123',
        });
      
      token = response.body.access_token;
    });

    it('/api/users (GET) should require authentication', () => {
      return request(app.getHttpServer())
        .get('/api/users')
        .expect(401);
    });

    it('/api/payments (GET) should require authentication', () => {
      return request(app.getHttpServer())
        .get('/api/payments')
        .expect(401);
    });

    it('/api/payments/stats (GET) should require authentication', () => {
      return request(app.getHttpServer())
        .get('/api/payments/stats')
        .expect(401);
    });

    if (token) {
      it('/api/users (GET) should return users with valid token', () => {
        return request(app.getHttpServer())
          .get('/api/users')
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .expect((res) => {
            expect(Array.isArray(res.body)).toBe(true);
          });
      });

      it('/api/payments/stats (GET) should return payment statistics', () => {
        return request(app.getHttpServer())
          .get('/api/payments/stats')
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('totalAmount');
            expect(res.body).toHaveProperty('totalTransactions');
          });
      });
    }
  });
});
