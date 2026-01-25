import request from 'supertest';
import express from 'express';
import { registerRoutes } from '../routes';

const app = express();
app.use(express.json());
registerRoutes(app);

describe('API Routes', () => {
  it('should return a 404 for an unknown route', async () => {
    const res = await request(app).get('/api/unknown');
    expect(res.statusCode).toEqual(404);
  });

  it('should return a 200 for the /api/learning-prompt route', async () => {
    const res = await request(app).get('/api/learning-prompt');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('prompt');
  });

  it('should return a 200 for the /api/ethics route', async () => {
    const res = await request(app).get('/api/ethics');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('guidelines');
  });

  it('should return a 400 for the /api/command route with no command', async () => {
    const res = await request(app).post('/api/command').send({});
    expect(res.statusCode).toEqual(400);
  });

  it('should return a 200 for the /api/command route with a command', async () => {
    const res = await request(app).post('/api/command').send({ command: 'nmap' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('response');
  });
});
