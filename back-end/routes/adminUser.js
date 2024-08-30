var express = require("express");
var router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const adminUserModel = require("../models/adminUserModel");

// show
router.get("/", async function (req, res, next) {
  try {
    const datas = await adminUserModel.find().populate("role");

    const data = datas.map((e) => ({
      id: e._id,
      name: e.name,
      email: e.email,
      password: e.password,
      role: e.role.name,
      created_at: e.created_at,
      updated_at: e.updated_at,
    }));
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({
      message: "Lỗi",
      error: error.message,
      stack: error.stack,
    });
  }
});

// thêm sp
router.post("/", async function (req, res, next) {
  const { name, email, password, role } = req.body;

  const existAdmin = await adminUserModel.findOne({ email: email });

  if (existAdmin) {
    return res.status(401).json({ message: "email đã được sử dụng" });
  }

  const newAd = new adminUserModel({
    name,
    email,
    password,
    role,
    created_at: new Date(),
    updated_at: new Date(),
  });

  const us = await newAd.save();

  if (us) {
    res.status(200).json({ message: "thêm nhân viên thành công", data: us });
  } else {
    res.status(500).json({ message: "lỗi khi thêm sản phẩm" });
  }
});
// sua
router.put("/:id", async function (req, res, next) {
  const { id } = req.params;

  const { name, email, password, role } = req.body;

  const existAdmin = await adminUserModel.findOne({ email: email });

  if (existAdmin) {
    return res.status(401).json({ message: "email đã được sử dụng" });
  }

  const adminUserUpdate = {
    name,
    email,
    password,
    role,
    updated_at: new Date(),
  };

  const data = await adminUserModel.findByIdAndUpdate(id, adminUserUpdate, {
    new: true,
  });

  if (data) {
    res.status(200).json({
      message: "Cập nhật nhân viên thành công",
      data: data,
    });
  } else {
    res.status(404).json({
      message: "nhân viên không tìm thấy",
    });
  }
});

// xoá

router.delete("/:id", async function (req, res, next) {
  try {
    const id = req.params.id;

    const adminUser = await adminUserModel.findByIdAndDelete(id);

    res
      .status(200)
      .json({ message: "xoá ng quản trị thành công", data: adminUser });
  } catch (error) {
    res.status(500).json({ message: "lỗi khi xoá sp", error });
  }
});

router.post("/login", async function (req, res, next) {
  const { email, password } = req.body;

  try {
    // tìm email
    const adminUser = await adminUserModel.findOne({ email: email });

    if (!adminUser) {
      return res.status(401).json({ message: "Email không tồn tại" });
    }

    // so sánh mật khẩu

    const isMatch = await bcrypt.compare(password, adminUser.password);

    if (!isMatch) {
      return res.status(401).json({ message: "mật khẩu không chính xác !!!" });
    }
    // tạo token
    const token = jwt.sign(
      { id: adminUser._id, role: adminUser.role },
      "secretKey",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "đăng nhập thành công",
      token: token,
    });
  } catch (error) {
    console.log("lỗi khi đăng nhập", error);
    res
      .status(500)
      .json({ message: "lỗi", error: error.message, stack: error.stack });
  }
});

// tìn nv theo tên

router.get("/search/:name", async function (req, res, next) {
  const name = req.params.name;

  const adminUser = await adminUserModel.find({ name: new RegExp(name, "i") });

  if (adminUser.length > 0) {
    res.status(200).json(adminUser);
  } else res.status(404).json({ message: "không tìm thấy nhân viên nào!!" });
});

// lọc danh sách nhân viên theo role
router.get("/role/:id", async function (req, res, next) {
  const id = req.params.id;
  try {
    const adminUser = await adminUserModel.find({ role: id }).populate("role");

    if (adminUser.length > 0) {
      const data = adminUser.map((e) => ({
        id: e._id,
        name: e.name,
        email: e.email,
        password: e.password,
        role: e.role.name,
        created_at: e.created_at,
        updated_at: e.updated_at,
      }));
      res.status(200).json(data);
    } else {
      res.status(401).json({ message: "không tìm thấy nhân viên nào " });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({
      message: "Lỗi khi lấy danh sách nhân viên",
      error: error.message,
    });
  }
});

// chi tiet

router.get("/:id", async function (req, res, next) {
  const id = req.params.id;

  const adminUser = await adminUserModel.findById(id).populate("role name");

  if (adminUser) {
    res.status(200).json(adminUser);
  } else {
    res.status(401).json({ message: " khong tim thay nhan vien" });
  }
});
module.exports = router;
