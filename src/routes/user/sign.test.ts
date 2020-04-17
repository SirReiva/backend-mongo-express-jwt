import supertest from 'supertest';
const request = supertest("http://localhost:3000");

describe('Sign Up', () => {
    it('should create a new user', () => {
        return request.post('/api/v1/signup').send({
            "email": "jhhh@gmail.com",
            "name": "jhhh",
            "password": "123456"
        }).then(res => {
            expect(res.body.name).toBe('jhhh');
        });
    })
});

describe('Sign In', () => {
    it('should create a new post', () => {
        return request.post('/api/v1/signin').send({
            "name": "jhhh",
            "password": "123456"
        }).expect(200).then(res => {
            expect(res.body).toHaveProperty('token');
            expect(res.body).toHaveProperty('refreshToken');
        });
    })
});