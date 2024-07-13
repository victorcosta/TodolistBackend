import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import Task from '../models/Task';

let token: string;

describe('Task Controller', () => {
    beforeAll(async () => {
      await mongoose.connect(process.env.MONGO_URI!)

        await request(app)
            .post('/api/auth/register')
            .send({ username: 'testuser', password: 'testpass' });

        const res = await request(app)
            .post('/api/auth/login')
            .send({ username: 'testuser', password: 'testpass' });

        token = res.body.token;
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    afterEach(async () => {
        await Task.deleteMany({});
    });

    it('should create a task', async () => {
        const res = await request(app)
            .post('/api/tasks')
            .set('Authorization', token)
            .send({ title: 'Test Task' });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('title', 'Test Task');
    });

    it('should get tasks', async () => {
        await request(app)
            .post('/api/tasks')
            .set('Authorization', token)
            .send({ title: 'Test Task' });

        const res = await request(app)
            .get('/api/tasks')
            .set('Authorization', token);

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('should update a task', async () => {
        const task = await request(app)
            .post('/api/tasks')
            .set('Authorization', token)
            .send({ title: 'Test Task' });

        const res = await request(app)
            .put(`/api/tasks/${task.body._id}`)
            .set('Authorization', token)
            .send({ title: 'Updated Task', completed: true });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('title', 'Updated Task');
        expect(res.body).toHaveProperty('completed', true);
    });

    it('should delete a task', async () => {
        const task = await request(app)
            .post('/api/tasks')
            .set('Authorization', token)
            .send({ title: 'Test Task' });

        const res = await request(app)
            .delete(`/api/tasks/${task.body._id}`)
            .set('Authorization', token);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Task deleted');
    });
});
