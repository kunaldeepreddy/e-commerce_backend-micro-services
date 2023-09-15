var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    user_id: { type: String, required: true },
    hash: { type: String, required: true },
    expires_by: { type: Number, required: true },
    is_used: { type: Boolean, default: false },
    inserted_at: { type: Number, default: Date.now }
}, { timestamps: false, versionKey: false });

var model = mongoose.model('password_resets', schema);
module.exports = model;