var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String, required: true },
        product: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "product",
		},
        is_active: { type: Boolean, default: true },
        inserted_at: { type: Number, default: Date.now },
        updated_at: { type: Number, default: Date.now },
    },
    { timestamps: false, versionKey: false }
);

var model = mongoose.model("homeCarouselProducts", schema);
module.exports = model;
