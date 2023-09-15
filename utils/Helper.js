const bcrypt = require("bcryptjs");
const Constants = require("../constants");
const DateUtil = require("./DateUtil");

const asyncErrorHandler = (fn) => (req, res, next) => {
	Promise.resolve(fn(req, res, next)).catch((err) => {
		const error = {
			status: 500,
			message: err.stack,
		};
		next(error);
	});
};

module.exports = {
	asyncErrorHandler,
	isValidEmail: (email) => {
		if (email.length != 0 && email.indexOf(".") >= 0 && email.indexOf("@") >= 0)
			return true;
		else return false;
	},
	getHashedPassword: (pwd) => {
		var salt = bcrypt.genSaltSync(10);
		return bcrypt.hashSync(pwd, salt);
	},

	getObjectReplica: (data, unwanted) => {
		let dt = {};
		let keys = Object.keys(data);
		keys.forEach((key) => {
			if (!unwanted.includes(key)) dt[key] = data[key];
		});
		return dt;
	},

	getProductImageName: (name) => {
		return (
			"product_" +
			DateUtil.getCurrentTime() +
			name.substring(name.lastIndexOf("."))
		);
	},

	getEntireObjectReplica: (data) => {
		let dt = {};
		let keys = Object.keys(data);
		keys.forEach((key) => {
			dt[key] = data[key];
		});
		return dt;
	},

	comparePasswords: (plainPwd, hashedPwd) => {
		return bcrypt.compareSync(plainPwd, hashedPwd);
	},

};
