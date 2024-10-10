const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const categoryModel = new Schema({
_id:{type: ObjectId},
parent_id: { type: Schema.Types.ObjectId, default: null }, // khóa chính
name: { type: String},
created_at: {type: Date, default: Date.now},
updated_at: {type: Date, default: Date.now}
});



module.exports = mongoose.models.category || mongoose.model('category', categoryModel);
// category -----> categories