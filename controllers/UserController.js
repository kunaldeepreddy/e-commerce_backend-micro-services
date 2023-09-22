const User = require("../models/User");
const ForgotPassword = require("../models/ForgotPassword");
const Constants = require("../constants");
const Helper = require("../utils/Helper");
const AuthUtil = require("../utils/AuthUtil");
const DateUtil = require("../utils/DateUtil");
const { v1: UUIDTimeStamp } = require("uuid");
const EmailUtil = require("../utils/EmailUtil");

module.exports = {
	forgotPassword: async (req, res) => {
		let data = req.body;
		if (!data.email) {
			return res.status(400).json({
				status: true,
				message: res.__("params_missing"),
			});
		}
		let user = await User.findOne({ email: data.email });
		if (!user) {
			return res.status(400).json({
				status: false,
				message: res.__("unregistered_email"),
			});
		}
		const records = await ForgotPassword.find({
			email: user.email,
			expires_by: { $gt: DateUtil.getCurrentTime() - 30 * 60 * 1000 },
		});
		if (records.length >= 3) {
			return res.status(403).json({
				status: false,
				message: res.__("too_many_requests"),
			});
		}
		var hash = UUIDTimeStamp();
		var time = new Date().getTime() + 30 * 60 * 1000;
		const record = await new ForgotPassword({
			hash: hash,
			user_id: user._id,
			expires_by: time,
		}).save();
		const result = await EmailUtil.sendForgotPasswordEmail(
			user.name,
			user.email,
			hash
		);
		console.log(result);
		if (result.status) {
			return res.json({
				status: true,
				message: res.__("forgot_pwd_email_sent"),
			});
		} else {
			// await record.remove();
			await ForgotPassword.findOneAndDelete({_id: record._id });
			return res.status(522).send({
				status: false,
				message: res.__("forgot_pwd_email_sending_failed"),
			});
		}
	},

	resetPassword: async (req, res) => {
		const data = req.query;
		if (!data.hash || !data.password) {
			return res.status(400).json({
				status: false,
				message: res.__("params_missing"),
			});
		}
		const record = await ForgotPassword.findOne({ hash: data.hash });
		if (!record) {
			return res.status(400).json({
				status: false,
				message: res.__("incorrect_hash_value"),
			});
		}
		if (record.expires_by < new Date().getTime()) {
			return res.status(400).json({
				status: false,
				message: res.__("link_expired"),
			});
		}
		if (record.is_used) {
			return res.status(400).json({
				status: false,
				message: res.__("link_already_used"),
			});
		}
		const user = await User.findById(record.user_id);
		if (!user) {
			return res.status(400).send({
				status: false,
				message: res.__("invalid_request"),
			});
		}
		var hashedPassword = await Helper.getHashedPassword(data.password);
		await User.findByIdAndUpdate(user._id, { password: hashedPassword });
		await ForgotPassword.findByIdAndUpdate(record._id, { is_used: true });
		return res.json({
			status: true,
			message: res.__("pwd_updated"),
		});
	},

	login: async (req, res) => {
		const data = req.body;
		if (!data.email || !data.password) {
			return res.status(400).json({
				status: false,
				message: res.__("params_missing"),
			});
		}
		data.email = data.email.toLowerCase();
		const user = await User.findOne({ email: data.email }).lean();
		if (!user) {
			return res.status(400).json({
				status: false,
				message: res.__("no_user_with_email"),
			});
		}
		if (!Helper.comparePasswords(data.password, user.password)) {
			return res.status(400).json({
				status: false,
				message: res.__("incorrect_pwd"),
			});
		}
		if (user.is_active == false) {
			return res.status(400).json({
				status: false,
				message: res.__("deactivated_account"),
			});
		}
		// await User.findByIdAndUpdate(user._id, { fcm_token: data.fcm_token });
		const user_details = Helper.getObjectReplica(user, [
			"password",
			"fcm_token",
			"is_active",
		]);
		user_details.token = AuthUtil.signToken(
			user._id,
			user.name,
			user.email,
			user.role
		);
		return res.status(200).send({
			status: true,
			message: res.__("success"),
			data: user_details,
		});
	},

	logout: async (req, res) => {
		var user_data = req.decoded_data;
		await User.findByIdAndUpdate(user_data.user_id, { fcm_token: null });
		return res.json({
			status: true,
			message: res.__("signed_out"),
		});
	},

	register: async (req, res) => {
		var email = req.body.email;
		var mobile_number = req.body.mobile_number;
		var password = req.body.password;
		var name = req.body.name;
		if (!password || !email || !mobile_number || !name) {
			return res.json({
				status: false,
				message: "missing fields",
			});
		}

		User.find({ email: email })
			.then((emailDetail) => {
				if (emailDetail.length >= 1) {
					return res.status(400).send({
						status: false,
						message: "email already exists",
					});
				} else {
					User.find({ mobile: mobile_number }).then((mobileDetail) => {
						if (mobileDetail.length >= 1) {
							res.json({
								status: false,
								message: "mobile number already exists",
							});
						} else {
							var emailToValidate = req.body.email;
							const emailRegexp =
								/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
							if (emailRegexp.test(emailToValidate) == false) {
								return res.json({
									status: false,
									error: "Invalid mailId",
								});
							}
							const user = new User({
								email: req.body.email,
								password: Helper.getHashedPassword(password),
								name: req.body.name,
								mobile: req.body.mobile_number,
								role: Constants.ROLE_USER,
							});
							user
								.save()
								.then(async (result) => {
									await result
										.save()
										.then((result1) => {
											let user_record = Helper.getObjectReplica(
												result1.toObject(),
												[]
											);
											user_record.token = AuthUtil.signToken(
												result1._id,
												result1.name,
												result1.email,
												result1.role
											);
											res.json({
												status: true,
												message: res.__("user added successfully"),
												data: user_record,
											});
										})
										.catch((err) => {
											res.json({
												status: false,
												message: err.toString(),
											});
										});
								})
								.catch((err) => {
									res.json({
										status: false,
										message: err.toString(),
									});
								});
						}
					});
				}
			})
			.catch((err) => {
				res.status(500).send({
					status: false,
					message: err.toString(),
				});
			});
	},
};
