var express = require("express");
var router = express.Router();

var modelCate = require("../models/categoryModel");
const categoryModel = require("../models/categoryModel");

// danh sách danh mục
router.get("/", async function (req, res, next) {
  var data = await modelCate.find();

  res.status(200).json(data);
});

// chi tiết danh mục
router.get("/:id", async function (req, res, next) {
  var { id } = req.params;
  var cate = await modelCate.findById(id);

  res.status(200).json(cate);
});

// truy xuất danh mục con
router.get("/parent/:parentId", async function (req, res, next) {
  var id = req.params.parentId;

  var cate = await modelCate.find({ parent_id: id });

  res.status(200).json(cate);
});
// truy xuất danh mục con
router.get("/parentCate", async function (req, res, next) {
  try {
    const cate = await modelCate.find({ parent_id: null });

    if (cate.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy danh mục cha nào" });
    }

    res.status(200).json(cate);
  } catch (error) {
    console.error("Lỗi khi truy xuất danh mục cha:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi truy xuất dữ liệu", error: error.message });
  }
});

// tìm danh mục theo tên
router.get("/search/:name", async function (req, res, next) {
  var name = req.params.name;

  const cate = await modelCate.find({ name: new RegExp(name, "i") });

  if (cate.length > 0) {
    res.status(200).json(cate);
  } else res.status(404).json({ message: "không tìm thấy danh mục nào" });
});
// thêm danh mục
router.post("/", async function (req, res, next) {
  const { parent_id, name } = req.body;

  try {
    const existCate = await modelCate.findOne({ name: name });

    if (existCate) {
      return res.status(400).json({
        message: "danh mục đã tồn tại",
      });
    }
    const newCate = new modelCate({
      parent_id,
      name,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const cate = await newCate.save();

    res.status(200).json({
      message: "thêm danh mục thành công",
      data: cate,
    });
  } catch (error) {
    res.status(500).json({
      message: "lỗi khi thêm danh mục",
      error: error.message,
    });
  }
});

// sửa danh mục
router.put("/:id", async function (req, res, next) {
  var id = req.params.id;

  const { parent_id, name } = req.body;

  try {
    const existCate = await modelCate.findOne({ name: name });

    if (existCate) {
      return res.status(400).json({
        message: "danh mục đã tồn tại",
      });
    }

    const cateUpdate = {
      parent_id,
      name,
      updated_at: new Date(),
    };

    const cate = await modelCate.findByIdAndUpdate(id, cateUpdate, {
      new: true,
    });

    if (cate) {
      res.status(200).json({
        message: "Cập nhật danh mục thành công",
        data: cate,
      });
    } else {
      res.status(404).json({
        message: "Danh mục không tìm thấy",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "lỗi khi chỉnh sửa danh mục",
      error: error.message,
    });
  }
});

// xoá danh mục

router.delete("/:id", async function (req, res, next) {
  var id = req.params.id;

  var cate = await modelCate.findByIdAndDelete(id);
  if (cate) {
    res.status(200).json({
      message: "xoá danh mục thành công",
      data: cate,
    });
  } else {
    res.status(404).json({
      message: "Danh mục không tìm thấy",
    });
  }
});

module.exports = router;
