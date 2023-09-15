var mongoose = require("mongoose");
var Schema = mongoose.Schema;
// const address = require("../models/Address");

var schema = new Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true },
		country_code: String,
		mobile: String,
		password: { type: String, required: true },
		role: { type: String, required: true },
		profile_pic: String,
		// addresses: [address],
		defaultAddressId: { type: String },
		is_active: { type: Boolean, default: true },
		fcm_token: String,
		inserted_at: { type: Number, default: Date.now },
		updated_at: { type: Number, default: Date.now },
	},
	{ timestamps: false, versionKey: false }
);

var model = mongoose.model("users", schema);
module.exports = model;
