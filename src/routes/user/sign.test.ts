import supertest from 'supertest';
const request = supertest('http://localhost:3000');

describe('Sign Up & Sign In', () => {
    it('should create a new user', (done) => {
        return request
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
        return request
            .post('/api/v1/signin')
            .send({
                name: 'admin',
                password: '123456',
            })
            .expect(200)
            .then((res) => {
                expect(res.body).toHaveProperty('token');
                expect(res.body).toHaveProperty('refreshToken');
            })
            .finally(done);
    });
});
