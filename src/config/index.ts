export default {
	PROJECT_NAME: 'IT´s CLOBBERIN TIME',
	JWTSECRET: 'secret',
	MEMCACHE_TIMEOUT: 240,
	JWT_EXPIRATION: 3600,
	JWT_EXPIRATION_REFRESH: 126000,
	DB: {
		NAME: 'csm',
		URL: 'mongodb://localhost/cms',
		USER: 'root',
		PASSWORD: 'root',
	},
	SWAGGER: {
		USER: 'root',
		PASSWORD: 'root',
	},
	VERSION: 'v1',
	RATE: {
		POINTS: 6,
		DURATION: 1,
		BLOCKDURATION: 2,
	},
};
