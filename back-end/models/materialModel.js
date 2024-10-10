const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const materialModel = new Schema({
id: { type: ObjectId }, // khóa chính
name: { type: String},
img: { type: String},
});
module.exports = mongoose.models.material || mongoose.model('material', materialModel);
// category -----> categories