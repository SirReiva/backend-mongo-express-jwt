import supertest from 'supertest';
let request: supertest.SuperTest<supertest.Test>;
process.env.NODE_ENV = 'test';
let disconnect: () => Promise<void>;
import { init } from '../../index';

// describe('Create Post', () => {
//     it('should create a new user', () => {
//         return request.post('/api/v1/signup').send({
//             "email": "jhhh@gmail.com",
//             "name": "jhhh",
//             "password": "123456"
//         }).then(res => {
//             expect(res.body.name).toBe('jhhh');
//         });
//     })
// });

describe('Get All Popts', () => {
    beforeAll(async () => {
        disconnect = (await init()).disconnect;
        request = supertest('http://127.0.0.1:3000');
    });
    it('should create a new post', () => {
        return request
            .get('/api/v1/posts')
            .send()
            .expect(200)
            .then((res) => {
                expect(res.body).toHaveProperty('docs');
            });
    });
    afterAll(async () => {
        await disconnect();
    });
});
