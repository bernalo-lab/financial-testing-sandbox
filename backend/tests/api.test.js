const request = require('supertest');
const app = require('../index');

describe('API Endpoints', () => {
  it('should return status OK', async () => {
    const res = await request(app).get('/api/status');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBeDefined();
  });

  it('should return a list of users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should echo posted JSON', async () => {
    const echo = { message: 'hello' };
    const res = await request(app)
      .post('/api/echo')
      .auth(process.env.DOCS_USER || 'admin', process.env.DOCS_PASS || 'password')
      .send(echo);
    expect(res.statusCode).toBe(200);
    expect(res.body.received.message).toBe('hello');
  });

  it('should respond to /health', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
  });
});