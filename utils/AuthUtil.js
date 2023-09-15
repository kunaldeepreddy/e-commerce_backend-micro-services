const JSONWebToken = require("jsonwebtoken");
const Constants = require("../constants");

module.exports = {
	signToken: (user_id, name, email, role) => {
		var token = JSONWebToken.sign(
			{
				user_id: user_id,
				name: name,
				email: email,
				role: role,
			},
			process.env.JWT_SECRET_KEY,
			{ expiresIn: process.env.TOKEN_EXPIRY }
		);
		return token;
	},

	decodeToken: (req, res, next) => {
		try {
			var token = req.headers.authorization;
			if (token != null && token.indexOf(" ") >= 0) token = token.split(" ")[1];
			var decoded = JSONWebToken.verify(token, process.env.JWT_SECRET_KEY);
			req.decoded_data = decoded;
			next();
		} catch (err) {
			next();
		}
	},

	validateToken: (req, res, next) => {
		const data = req.decoded_data;
		if (
			data &&
			(data.role == Constants.ROLE_ADMIN || data.role == Constants.ROLE_USER)
		) {
			next();
		} else {
			return res.status(401).send({
				status: false,
				message: res.__("not_authorized"),
			});
		}
	},

	validateAdmin: (req, res, next) => {
		const data = req.decoded_data;
		if (data && data.role == Constants.ROLE_ADMIN) next();
		else {
			return res.status(401).send({
				status: false,
				message: res.__("not_authorized"),
			});
		}
	},
};
