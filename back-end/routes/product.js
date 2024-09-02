var express = require("express");

var router = express.Router();

var productModel = require("../models/productModel");
var categoryModel = require("../models/categoryModel");

// show danh sách
router.get("/", async function (req, res, next) {
  try {
    const datas = await productModel
      .find()
      .populate("material")
      .populate("category");

    const data = datas.map((e) => ({
      id: e._id, // khóa chính
      name: e.name,
      description: e.description,
      price: e.price,
      stock: e.stock,
      weight: e.weight,
      sales: e.sales,
      material: e.material.name, // khóa phụ
      category: e.category.name, // khóa phụ
      created_at: e.created_at,
      updated_at: e.updated_at,
    }));

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// show chi tiết

router.get("/:id", async function (req, res, next) {
  var id = req.params.id;

  var pro = await productModel.findById(id);

  if (pro) {
    res.status(200).json(pro);
  } else res.status(500).json({ message: "lỗi khi lấy chi tiết sp" });
});

// lấy sp theo danh mục
router.get("/cate/:id", async function (req, res, next) {
  try {
    var id = req.params.id;

    var datas = await productModel
      .find({ category: id })
      .populate("material")
      .populate("category");

    const data = datas.map((e) => ({
      id: e._id, // khóa chính
      name: e.name,
      description: e.description,
      price: e.price,
      stock: e.stock,
      weight: e.weight,
      material: e.material.name, // khóa phụ
      category: e.category.name, // khóa phụ
      created_at: e.created_at,
      updated_at: e.updated_at,
    }));

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// tìm sp theo chất liệu (material)
router.get("/material/:id", async function (req, res, next) {
  try {
    var id = req.params.id;

    var datas = await productModel
      .find({ material: id })
      .populate("material")
      .populate("category");

    const data = datas.map((e) => ({
      id: e._id,
      name: e.name,
      description: e.description,
      price: e.price,
      stock: e.stock,
      weight: e.weight,
      material: e.material.name,
      category: e.category.name,
      created_at: e.created_at,
      updated_at: e.updated_at,
    }));

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// tìm sp theo danh mục cha
router.get("/parentID/:id", async function (req, res, next) {
  try {
    var id = req.params.id;
    // Tìm tất cả danh mục con của danh mục cha
    var subCates = await categoryModel.find({ parent_id: id });

    // Lấy danh sách các danh mục con
    var subCate = subCates.map((category) => category.id);

    // Tìm tất cả sản phẩm thuộc các danh mục con
    var datas = await productModel
      .find({ category: { $in: subCate } })
      .populate("material")
      .populate("category");

    const data = datas.map((e) => ({
      id: e._id,
      name: e.name,
      description: e.description,
      price: e.price,
      stock: e.stock,
      weight: e.weight,
      material: e.material.name,
      category: e.category.name,
      created_at: e.created_at,
      updated_at: e.updated_at,
    }));

    // Nếu tìm thấy sản phẩm
    if (data.length > 0) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: "Không tìm thấy sản phẩm nào." });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// tìm sp theo tên
router.get("/search/:name", async function (req, res, next) {
  var name = req.params.name;

  const product = await productModel
    .find({ name: new RegExp(name, "i") })
    .populate("material")
    .populate("category");

  if (product.length > 0) {
    const data = product.map((e) => ({
      id: e._id,
      name: e.name,
      description: e.description,
      price: e.price,
      stock: e.stock,
      weight: e.weight,
      material: e.material.name,
      category: e.category.name,
      created_at: e.created_at,
      updated_at: e.updated_at,
    }));
    res.status(200).json(data);
  } else res.status(404).json({ message: "không tìm thấy danh mục nào" });
});

// sp có sl tồn kho dưới 2

router.get("/products-low-stock", async function (req, res, next) {
  var product = await productModel.find({ stock: { $lt: 2 } });

  if (product.length > 0) {
    const data = product.map((e) => ({
      id: e._id,
      name: e.name,
      stock: e.stock,
    }));
    res.status(200).json(data);
  } else {
    res.status(400).json({ message: "không có sản phẩm hết hàng" });
  }
});

// 4 sp vừa thêm gần nhất
router.get("/new-product", async function (req, res, next) {
  const newPro = await productModel.find().sort({ created_at: -1 }).limit(4);

  if (newPro.length > 0) {
    const data = newPro.map((e) => ({
      id: e._id,
      name: e.name,
      stock: e.stock,
    }));
    res.status(200).json(data);
  } else {
    res.status(400).json({ message: "không có sản phẩm mới nhất" });
  }
});

// 5 sp hot
router.get("/hot-product", async function (req, res, next) {
  const pro = await productModel.find().sort({ sales: -1 }).limit(5);
  if (pro.length > 0) {
    const data = pro.map((e) => ({
      id: e._id,
      name: e.name,
      sales: e.sales,
    }));
    res.status(200).json(data);
  } else {
    res.status(400).json({ message: "không có sản phẩm mới nhất" });
  }
});

// tìm sp trong khoảng giá từ min tới max
router.get("/:min/:max", async function (req, res, next) {
  var min = req.params.min;
  var max = req.params.max;

  const pro = await productModel.find({
    $or: [{ price: { $gt: min, $lt: max } }],
  });
  if (pro.length > 0) {
    const data = pro.map((e) => ({
      id: e._id,
      name: e.name,
      price: e.price,
    }));
    res.status(200).json(data);
  } else {
    res.status(400).json({ message: "không có sản phẩm " });
  }
});

// thêm sp
router.post("/", async function (req, res, next) {
  const { name, description, price, stock, material, weight, category } =
    req.body;

  try {
    const existPro = await productModel.findOne({ name: name });

    if (existPro) {
      return res.status(400).json({
        message: "sản phầm đã tồn tại",
      });
    }

    const newPro = new productModel({
      name,
      description,
      price,
      stock,
      material,
      weight,
      category,
      created_at: new Date(),
      updated_at: new Date(),
      sales: 0,
    });

    const pro = await newPro.save();
    res.status(200).json({
      message: "thêm danh mục thành công",
      data: pro,
    });
  } catch (error) {
    res.status(500).json({
      message: "lỗi khi thêm danh mục",
      error: error.message,
    });
  }
});

// sửa  sp
router.put("/:id", async function (req, res, next) {
  const id = req.params.id;
  const { name, description, price, stock, material, weight, category } =
    req.body;

  try {
    const existPro = await productModel.findOne({ name: name });

    if (existPro) {
      return res.status(400).json({
        message: "sản phầm đã tồn tại",
      });
    }

    const updatePro = {
      name,
      description,
      price,
      stock,
      material,
      weight,
      category,
      updated_at: new Date(),
    };

    const pro = await productModel.findByIdAndUpdate(id, updatePro, {
      new: true,
    });
    if (pro) {
      res.status(200).json({
        message: "Cập nhật sản phẩm   thành công",
        data: pro,
      });
    } else {
      res.status(404).json({
        message: "sản phẩm  không tìm thấy",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "lỗi khi thêm danh mục",
      error: error.message,
    });
  }
});

// thêm số lượng sp
router.patch("/:id", async function (req, res, next) {
  const id = req.params.id;
  const { stock } = req.body;

  if (stock === undefined || stock < 0) {
    return res.status(400).json({
      message: " số lượng nhập vào không hợp lệ",
    });
  }

  try {
    const pros = await productModel.findById(id);

    if (!pros) {
      return res.status(404).json({
        message: "Sản phẩm không tìm thấy",
      });
    }

    const newStock = pros.stock + stock;

    const pro = await productModel.findByIdAndUpdate(
      id,
      { stock: newStock, updated_at: new Date() },
      {
        new: true,
      }
    );
    if (pro) {
      res.status(200).json({
        message: "Cập nhật số lượng sản phẩm thành công",
        data: pro,
      });
    } else {
      res.status(404).json({
        message: "sản phẩm  không tìm thấy",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "lỗi khi sửa sp",
      error: error.message,
    });
  }
});

// xoá sp
router.delete("/:id", async function (req, res, next) {
  const id = req.params.id;

  const product = await productModel.findByIdAndDelete(id);

  if (product) {
    res.status(200).json({
      message: "xoá danh mục thành công",
      data: product,
    });
  } else {
    res.status(404).json({
      message: "Danh mục không tìm thấy",
    });
  }
});

module.exports = router;
