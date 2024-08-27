const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const categoryModel = new Schema({

parent_id: { type: ObjectId || null }, // khóa chính
name: { type: String},
created_at: {type: Date, default: Date.now},
updated_at: {type: Date, default: Date.now}
});

// Thêm virtual id
categoryModel.virtual("id").get(function () {
    return this._id.toHexString();
  });
  
  // Đảm bảo rằng virtuals được bao gồm khi chuyển đổi sang JSON
  categoryModel.set("toJSON", {
    virtuals: true,
  });

module.exports = mongoose.models.category || mongoose.model('category', categoryModel);
// category -----> categories