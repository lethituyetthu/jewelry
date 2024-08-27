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
  const pro = await productModel.find().sort({sales:-1}).limit(5)
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


router.get('/:min/:max',async function (req, res, next) {

  var min = req.params.min;
  var max = req.params.max;

  const pro = await productModel.find({$or: [ { price: { $gt: min,$lt :max }  } ],})
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
  
})


module.exports = router;
