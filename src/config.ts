const config = {
	production: {
		apiUrl: 'http://localhost:3010'
	},
	development: {
		apiUrl: 'http://localhost:3010'
	}
};

const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const envConfig = config[env];

export { envConfig as config };
