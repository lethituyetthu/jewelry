const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const roleModel = new Schema({
id: { type: ObjectId }, // khóa chính
name: { type: String},
});
module.exports = mongoose.models.role || mongoose.model('role', roleModel);
// category -----> categories