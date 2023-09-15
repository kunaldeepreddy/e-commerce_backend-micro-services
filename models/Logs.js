var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    req_id: String,
    user_id: String,
    url: String,
    method: String,
    body: Object,
    response: Object,
    data: String,
    status_code: Number,
    inserted_at: { type: Number, default: Date.now },
}, { versionKey: false, timestamps: false });

var model = mongoose.model('logs', schema);
module.exports = model;