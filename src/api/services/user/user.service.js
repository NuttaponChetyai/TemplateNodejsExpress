exports.verifyUser = ({ username = '', password = '' }) => {	
	if(username === 'test' && password === 'p@ssw0rd') {
		return {
			username : 'test',
			name: 'foo',
			lastname: 'bars',
			email: 'foobar@mail.com'
		};
	}
};