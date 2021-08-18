import { MongoMemoryServer } from 'mongodb-memory-server';
import { Mongoose } from 'mongoose';
import supertest from 'supertest';
import { app } from '../../app';
import { connect } from '../../database';
let request: supertest.SuperTest<supertest.Test>;
let mongo: Mongoose | MongoMemoryServer;
process.env.NODE_ENV = 'test';

describe('Sign Up & Sign In', () => {
    beforeAll(async () => {
        mongo = await connect();
        request = supertest(app);
    });

    afterAll(async () => {
        //@ts-ignore
        const endMongo = mongo.disconnect || mongo.stop;

        await endMongo.bind(mongo)();
    });

    it('should create a new user', done => {
        request
            .post('/api/v1/signup')
            .send({
                email: 'jhhh@gmail.com',
                name: 'jhhh',
                password: '123456',
            })
            .then(res => {
                expect(res.body.name).toBe('jhhh');
            })
            .finally(done);
    });

    it('should be logged', done => {
        request
            .post('/api/v1/signin')
            .send({
                name: 'jhhh',
                password: '123456',
            })
            .then(res => {
                expect(res.body).toHaveProperty('token');
                expect(res.body).toHaveProperty('refreshToken');
            })
            .catch(err => {
                console.log('ERR', err);
                expect(err).toBe(undefined);
            })
            .finally(done);
    });
});
