const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const ObjectId = Schema.ObjectId;

const AdminUserSchema = new mongoose.Schema({
  id: {type: ObjectId},
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  role: { type: ObjectId, ref:'role'},
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// Middleware trước khi lưu: mã hóa mật khẩu
AdminUserSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Kiểm tra mật khẩu khi đăng nhập
AdminUserSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    throw new Error(err);
  }
};

module.exports =
  mongoose.models.admin || mongoose.model("admin", AdminUserSchema);
