import { Mongoose } from 'mongoose';
import supertest from 'supertest';
import { app } from '../../app';
import { connect } from '../../database';
let request: supertest.SuperTest<supertest.Test>;
let mongo: Mongoose;
process.env.NODE_ENV = 'test';

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
		mongo = await connect();
		request = supertest(app);
	});

	afterAll(async () => {
		await mongo.disconnect();
	});
	it('should create a new post', () => {
		return request
			.get('/api/v1/posts')
			.send()
			.expect(200)
			.then(res => {
				expect(res.body).toHaveProperty('docs');
			});
	});
});
