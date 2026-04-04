// =============================================
// SSP Books Backend - API Tests
// =============================================

process.env.NODE_ENV = 'test';

jest.mock('../src/config/database', () => ({
  query: jest.fn(),
  getClient: jest.fn(),
}));

const request = require('supertest');
const { query } = require('../src/config/database');
const app = require('../src/server');

const mockCourses = [
  {
    id: 1,
    title: 'Node.js Fundamentals',
    slug: 'nodejs-fundamentals',
    price: '49.99',
    is_featured: true,
  },
];

const mockCategories = [
  {
    id: 1,
    name: 'Programming',
    slug: 'programming',
    course_count: 1,
  },
];

beforeEach(() => {
  query.mockReset();
  query.mockImplementation(async (sql) => {
    const normalizedSql = sql.replace(/\s+/g, ' ').trim();

    if (normalizedSql.includes('SELECT COUNT(*) as total') && normalizedSql.includes('FROM courses c')) {
      return {
        rows: [{ total: String(mockCourses.length) }],
        rowCount: 1,
      };
    }

    if (normalizedSql.includes('FROM courses c') && normalizedSql.includes('WHERE c.is_featured = TRUE')) {
      return {
        rows: mockCourses.filter((course) => course.is_featured),
        rowCount: mockCourses.length,
      };
    }

    if (normalizedSql.includes('FROM categories cat')) {
      return {
        rows: mockCategories,
        rowCount: mockCategories.length,
      };
    }

    if (normalizedSql.includes('FROM courses c')) {
      return {
        rows: mockCourses,
        rowCount: mockCourses.length,
      };
    }

    return {
      rows: [],
      rowCount: 0,
    };
  });
});

describe('SSP Books API', () => {
  // Health Check
  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('SSP Books API is running');
    });
  });

  // 404 Handler
  describe('GET /api/nonexistent', () => {
    it('should return 404 for unknown routes', async () => {
      const res = await request(app).get('/api/nonexistent');
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  // Auth Routes
  describe('POST /api/auth/register', () => {
    it('should require name, email, and password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({});
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject short passwords', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test', email: 'test@test.com', password: '123' });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should require email and password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({});
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should require authentication', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.statusCode).toBe(401);
    });
  });

  // Course Routes
  describe('GET /api/courses', () => {
    it('should return courses list', async () => {
      const res = await request(app).get('/api/courses');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('pagination');
    });
  });

  describe('GET /api/courses/featured', () => {
    it('should return featured courses', async () => {
      const res = await request(app).get('/api/courses/featured');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // Category Routes
  describe('GET /api/categories', () => {
    it('should return categories list', async () => {
      const res = await request(app).get('/api/categories');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // Cart Routes
  describe('GET /api/cart', () => {
    it('should require authentication', async () => {
      const res = await request(app).get('/api/cart');
      expect(res.statusCode).toBe(401);
    });
  });

  // Order Routes
  describe('GET /api/orders', () => {
    it('should require authentication', async () => {
      const res = await request(app).get('/api/orders');
      expect(res.statusCode).toBe(401);
    });
  });
});
