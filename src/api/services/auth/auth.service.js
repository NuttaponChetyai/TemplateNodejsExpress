const { jwtSecret, jwtExpirationInterval } = require('../../../configs/vars');
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');

exports.generateJWT = (user, channel) => {
	try {
		const newUserObject = {
			username: user.username,
			firstname: user.firstname,
			lastname: user.lastname,
			email: user.email
		};
		let subObj = {
			informations: newUserObject,
			channel_login: channel
		};
		const playload = {
			iat: dayjs().unix(),
			sub: subObj,

		};
		const accessToken = jwt.sign(playload, jwtSecret, {
			expiresIn: jwtExpirationInterval * 60
		});
		let token = crypto.randomBytes(64).toString('hex');
		let objData = {
			username: user.username,
			access_token: accessToken,
			refresh_token: token
		};
		return objData;
	} catch (err) {
		throw err;
	}
};