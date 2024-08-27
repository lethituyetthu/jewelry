const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


const productModel = new Schema({
id: { type: ObjectId }, // khóa chính
name: {type:String },
description: { type: String},
price: { type: Number},
stock: { type: Number},
weight: { type: Number},
sales: { type: Number},
material: { type: ObjectId, ref:'material' }, // khóa chính
category: { type: ObjectId, ref:'category' }, // khóa chính
created_at: {type: Date, default: Date.now},
updated_at: {type: Date, default: Date.now}
});


module.exports = mongoose.models.product || mongoose.model('product', productModel);
// category -----> categories