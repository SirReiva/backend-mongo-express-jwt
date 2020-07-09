import supertest from 'supertest';
let request: supertest.SuperTest<supertest.Test>;
let disconnect: () => Promise<void>;
process.env.NODE_ENV = 'test';
import { init } from '../../index';

describe('Sign Up & Sign In', () => {
    beforeAll(async () => {
        disconnect = (await init()).disconnect;
        request = supertest('http://localhost:3000');
    });

    afterAll(async () => {
        await disconnect();
    });

    it('should create a new user', (done) => {
        request
            .post('/api/v1/signup')
            .send({
                email: 'jhhh@gmail.com',
                name: 'jhhh',
                password: '123456',
            })
            .then((res) => {
                expect(res.body.name).toBe('jhhh');
            })
            .finally(done);
    });

    it('should be logged', (done) => {
        request
            .post('/api/v1/signin')
            .send({
                name: 'jhhh',
                password: '123456',
            })
            .then((res) => {
                expect(res.body).toHaveProperty('token');
                expect(res.body).toHaveProperty('refreshToken');
            })
            .catch((err) => {
                console.log('ERR', err);
                expect(err).toBe(undefined);
            })
            .finally(done);
    });
});
