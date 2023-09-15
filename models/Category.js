var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema(
	{
		name: { type: String, required: true },
		// ancestors: [String],
		tags: [String],
		// parent: {
		// 	type: Schema.Types.ObjectId,
		// 	ref: "categories",
		// },
		// level: { type: Number, default: 1 },
		// display_on_home: { type: Boolean, default: false },
		is_active: { type: Boolean, default: true },
		inserted_at: { type: Number, default: Date.now },
		updated_at: { type: Number, default: Date.now },
	},
	{ timestamps: false, versionKey: false }
);

var model = mongoose.model("categories", schema);
module.exports = model;
