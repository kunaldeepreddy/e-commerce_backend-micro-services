var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema(
	{
		name: { type: String, required: true },
		images: [],
		display_pic: { type: String, required: true },
		description: String,
		sku_code: { type: String, required: true },
		weight: { type: Number, required: true },
		price: { type: Number, required: true },
		offer_price: { type: Number, default: 0 },
        ancestors: [String],
		tags: [String],
		category: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "categories",
		},
		total_qty: { type: Number, default: 0 },
		qty_sold: { type: Number, default: 0 },
		is_active: { type: Boolean, default: true },
		rating: { type: Number, default: 1 },
		inserted_at: { type: Number, default: Date.now },
		updated_at: { type: Number, default: Date.now },
	},
	{ timestamps: false, versionKey: false }
);

var model = mongoose.model("products", schema);
module.exports = model;
