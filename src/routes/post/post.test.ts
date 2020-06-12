import supertest from 'supertest';
const request = supertest('http://localhost:3000');

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
    it('should create a new post', () => {
        return request
            .get('/api/v1/posts')
            .send()
            .expect(200)
            .then((res) => {
                expect(res.body).toHaveProperty('docs');
            });
    });
});
