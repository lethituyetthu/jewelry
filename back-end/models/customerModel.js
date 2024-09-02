const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const customerModel = new Schema({
  id: { type: ObjectId },
  name: { type: String },
  email: { type: String, unique: true },
  phone: { type: String,unique: true },
  address: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.models.customers || mongoose.model('customers', customerModel);
